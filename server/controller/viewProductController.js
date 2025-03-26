// const Product = require("../models/farmerProduct");
// const User = require("../models/usr");
// const { Web3 } = require("web3");
// const axios = require("axios"); // For Google Geocoding API
// const contractABI = require("../contractABI.json");

// const contractAddress = process.env.CONTRACT_ADDRESS; // Contract address from .env
// const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Google Maps API key from .env

// // Connect to Sepolia Ethereum Node
// const web3 = new Web3(process.env.INFURA_URL);
// const contract = new web3.eth.Contract(contractABI, contractAddress);

// exports.getProductsByLocation = async (req, res) => {
//     try {
//         const { latitude, longitude } = req.body; // Get location from frontend

//         if (!latitude || !longitude) {
//             return res.status(400).json({ error: "Latitude and longitude are required." });
//         }

//         // **Convert Latitude & Longitude to District Name using Google Maps API**
//         const geoResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
//             params: {
//                 latlng: `${latitude},${longitude}`,
//                 key: GOOGLE_API_KEY,
//             }
//         });

//         if (!geoResponse.data || geoResponse.data.status !== "OK" || geoResponse.data.results.length === 0) {
//             return res.status(400).json({ error: "Unable to determine location from coordinates." });
//         }

//         const addressComponents = geoResponse.data.results[0].address_components;
//         const districtComponent = addressComponents.find(component =>
//             component.types.includes("administrative_area_level_2")
//         );

//         if (!districtComponent) {
//             return res.status(400).json({ error: "District could not be determined from location." });
//         }

//         const customerDistrict = districtComponent.long_name;
//         console.log("Detected District:", customerDistrict);

//         // **Find Farmers in the Detected District**
//         const farmersInDistrict = await User.find({ userType: "farmer", "farmDetails.district": customerDistrict });
//         const farmerIds = farmersInDistrict.map(farmer => farmer._id);

//         // **Fetch Products from MongoDB**
//         const products = await Product.find({ farmerId: { $in: farmerIds } })
//             .populate("farmerId", "displayName");

//         if (!products.length) {
//             return res.status(404).json({ message: `No products available in ${customerDistrict}.` });
//         }

//         // **Cross-check Products with Blockchain**
//         const verifiedProducts = [];
//         for (const product of products) {
//             try {
//                 const blockchainData = await contract.methods.getProductDetails(product._id.toString()).call();

//                 if (blockchainData[0] !== "0x0000000000000000000000000000000000000000") {
//                     verifiedProducts.push({
//                         _id: product._id,
//                         name: product.name,
//                         description: product.description,
//                         price: product.price,
//                         image: product.image,
//                         farmerName: product.farmerId.displayName,
//                         blockchainVerified: true,
//                     });
//                 }
//             } catch (err) {
//                 console.error(`Blockchain verification failed for product ${product._id}:`, err);
//             }
//         }

//         res.status(200).json({
//             success: true,
//             district: customerDistrict,
//             data: verifiedProducts
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to fetch products based on location." });
//     }
// };



const Product = require("../models/farmerProduct");
const User = require("../models/usr");
const { Web3 } = require("web3");
const contractABI = require("../contractABI.json");

const contractAddress = process.env.CONTRACT_ADDRESS; // Smart Contract Address
const web3 = new Web3(process.env.INFURA_URL);
const contract = new web3.eth.Contract(contractABI, contractAddress);

exports.getAllProducts = async (req, res) => {
    try {
        // **Fetch All Products from MongoDB**
        const products = await Product.find().populate("farmerId", "displayName");

        if (!products.length) {
            return res.status(404).json({ message: "No products available." });
        }

        // **Cross-check Products with Blockchain**
        const verifiedProducts = [];
        for (const product of products) {
            try {
                const blockchainData = await contract.methods.getProductDetails(product._id.toString()).call();

                if (blockchainData[0] !== "0x0000000000000000000000000000000000000000") {
                    verifiedProducts.push({
                        _id: product._id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.image,
                        farmerName: product.farmerId.displayName,
                        blockchainVerified: true,
                    });
                }
            } catch (err) {
                console.error(`Blockchain verification failed for product ${product._id}:`, err);
            }
        }

        res.status(200).json({
            success: true,
            data: verifiedProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products." });
    }
};
