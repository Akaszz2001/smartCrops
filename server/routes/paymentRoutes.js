const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

// ➤ Create Order API (Backend)
router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;  // Amount in INR
        const options = {
            amount: amount * 100, // Razorpay expects paise (INR * 100)
            currency: "INR",
            receipt: `order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, error: "Payment initiation failed." });
    }
});

// ➤ Verify Payment API (Backend)
router.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");

        if (generated_signature === razorpay_signature) {
            res.status(200).json({ success: true, message: "Payment verified successfully." });
        } else {
            res.status(400).json({ success: false, error: "Invalid payment signature." });
        }
    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ success: false, error: "Payment verification failed." });
    }
});

module.exports = router;
