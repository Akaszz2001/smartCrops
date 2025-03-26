const express = require("express");
const Product = require("../models/farmerProduct");
const upload = require("../utils/cloudinaryConfig");
const router = express.Router();
const User = require("../models/usr");
const isAuthenticated = require("../midilleware/auth");
const axios = require("axios");
const { Web3 } = require("web3");

// 🔹 Blockchain Setup
const web3 = new Web3(process.env.INFURA_URL);
const contractABI = require("../contractABI.json");
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);
const adminAccount = web3.eth.accounts.privateKeyToAccount(`0x${process.env.PRIVATE_KEY.trim()}`);
web3.eth.accounts.wallet.add(adminAccount);

console.log("✅ Using Admin Wallet:", adminAccount.address);

// ➤ ADD PRODUCT ROUTE
router.post("/addProduct", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
        if (req.user.userType !== "farmer") {
            return res.status(403).json({ error: "Only farmers can add products." });
        }

        const { name, description, price, cropType, quantity, unit = "kg" } = req.body;
        if (!name || !description || !price || !cropType || !quantity) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const farmer = await User.findById(req.user._id);
        if (!farmer || !farmer.farmDetails) {
            return res.status(404).json({ error: "Farmer details not found." });
        }

        const { state, district } = farmer.farmDetails;

        // 🔹 Fetch market price
        const apiResponse = await axios.get(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`, {
            params: {
                "api-key": process.env.CROP_API,
                format: "json",
                limit: 20,
                "filters[state.keyword]": state,
                "filters[district]": district,
                "filters[commodity]": cropType
            }
        });

        const marketData = apiResponse.data.records[0];
        if (!marketData) {
            return res.status(404).json({ error: "Market data for the crop not found." });
        }

        const marketPrice = parseFloat(marketData.modal_price);
        const assumedUnit = "quintal";
        let convertedFarmerPrice = parseFloat(price);

        if (assumedUnit === "quintal" && unit === "kg") {
            convertedFarmerPrice *= 100;
        } else if (assumedUnit === "kg" && unit === "quintal") {
            convertedFarmerPrice /= 100;
        }

        if (convertedFarmerPrice > marketPrice) {
            return res.status(400).json({
                error: `The price for ${cropType} cannot exceed the market price of ₹${marketPrice} per ${assumedUnit}.`
            });
        }

        // 🔹 Save Product in MongoDB
        const product = new Product({
            farmerId: req.user._id,
            name,
            description,
            price,
            cropType,
            quantity,
            image: req.file ? req.file.path : null,
        });

        const savedProduct = await product.save();
        console.log("✅ Product saved in MongoDB:", savedProduct._id.toString());

        // 🔹 Blockchain Transaction
        const priceInWei = web3.utils.toWei(price.toString(), "ether");
        const txData = contract.methods.addProduct(
            savedProduct._id.toString(),  // Product ID from MongoDB
            req.user._id.toString(),      // Farmer ID from MongoDB
            priceInWei
        ).encodeABI();

        const nonce = await web3.eth.getTransactionCount(adminAccount.address, "latest");

        const txObject = {
            from: adminAccount.address,
            to: contractAddress,
            data: txData,
            nonce,
            gasLimit: 3000000,
            maxPriorityFeePerGas: web3.utils.toWei("2", "gwei"),
            maxFeePerGas: web3.utils.toWei("350", "gwei"),
            value: 0
        };

        const signedTx = await web3.eth.accounts.signTransaction(txObject, process.env.PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("✅ Blockchain TX Hash:", receipt.transactionHash);

        res.status(201).json({
            success: true,
            message: "Product added successfully and stored on blockchain.",
            product: savedProduct,
            blockchainTx: receipt.transactionHash
        });
    } catch (error) {
        console.error("❌ Error Adding Product:", error);
        res.status(500).json({ error: "Server error." });
    }
});

// ➤ GET PRODUCTS WITH BLOCKCHAIN VALIDATION
router.get("/myProducts", isAuthenticated, async (req, res) => {
    try {
        if (req.user.userType !== "farmer") {
            return res.status(403).json({ error: "Only farmers can view their products." });
        }

        const products = await Product.find({ farmerId: req.user._id });

        // 🔹 Validate Products on Blockchain
        const verifiedProducts = await Promise.all(
            products.map(async (product) => {
                try {
                    const blockchainData = await contract.methods.getProduct(product._id.toString()).call();

                    if (
                        blockchainData.name === product.name &&
                        web3.utils.fromWei(blockchainData.price, "ether") === product.price.toString()
                    ) {
                        return product;
                    } else {
                        console.warn(`⚠️ Data mismatch for Product ID: ${product._id}`);
                        return {
                            ...product.toObject(),
                            warning: "Data mismatch with blockchain.",
                        };
                    }
                } catch (error) {
                    console.error(`❌ Blockchain validation error for Product ID: ${product._id}`, error);
                    return {
                        ...product.toObject(),
                        warning: "Blockchain validation failed.",
                    };
                }
            })
        );

        res.status(200).json({
            success: true,
            data: verifiedProducts,
        });
    } catch (error) {
        console.error("❌ Error Fetching Products:", error);
        res.status(500).json({ error: "Server error while fetching products." });
    }
});

module.exports = router;
