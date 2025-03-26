const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/farmerProduct");
const isAuthenticated = require("../midilleware/auth");

const router = express.Router();

// ➤ ADD TO CART
router.post("/add", isAuthenticated, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: "Product not found." });

        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json({ success: true, message: "Product added to cart." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error." });
    }
});

// ➤ VIEW CART (Including Total Price)
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ error: "Your cart is empty." });
        }

        // **Calculate Total Price**
        let totalAmount = 0;
        cart.items.forEach(item => {
            totalAmount += item.quantity * item.productId.price;
        });

        res.status(200).json({ success: true, data: cart.items, totalAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error." });
    }
});

// ➤ REMOVE ITEM FROM CART
router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.user._id },
            { $pull: { items: { productId: req.params.id } } },
            { new: true }
        );
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error." });
    }
});

// ➤ PAYMENT SIMULATION (Stripe Integration can be added here)
router.post("/checkout", isAuthenticated, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty. Add products before checkout." });
        }

        let totalAmount = 0;
        cart.items.forEach(item => {
            totalAmount += item.quantity * item.productId.price;
        });

        // **Simulate Payment (Replace with Stripe/PayPal API)**
        console.log(`User ${req.user._id} is checking out with total ₹${totalAmount}`);

        res.status(200).json({ success: true, message: "Payment Successful", totalAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Payment failed." });
    }
});

module.exports = router;
