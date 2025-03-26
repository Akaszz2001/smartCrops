import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [user, setUser] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/user/dashboard", { withCredentials: true })
            .then((res) => {
                if (res.data.user) {
                    setUser(res.data.user);
                    if (res.data.user.userType === "farmer") {
                        navigate("/farmer-home");
                        console.log("cart"+user);
                        
                    }
                } else {
                    navigate("/");
                }
            })
            .catch(() => navigate("/"));

        const fetchCart = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/customer/cart", {
                    withCredentials: true
                });

                setCartItems(response.data.data);
                calculateTotal(response.data.data);
            } catch (error) {
                console.error(error);
                setErrorMessage(error.response?.data?.error || "Failed to fetch cart items.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // 🔹 Calculate Total Price
    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // 🔹 Increase Quantity
    const increaseQuantity = async (productId) => {
        try {
            await axios.post(
                "http://localhost:5000/api/customer/cart/add",
                { productId, quantity: 1 },
                { withCredentials: true }
            );

            setCartItems((prev) =>
                prev.map((item) =>
                    item.productId._id === productId ? { ...item, quantity: item.quantity + 1 } : item
                )
            );

            calculateTotal(cartItems);
        } catch (error) {
            console.error("Failed to increase quantity.", error);
        }
    };

    // 🔹 Decrease Quantity
    const decreaseQuantity = async (productId) => {
        try {
            const item = cartItems.find((item) => item.productId._id === productId);
            if (item.quantity === 1) {
                return handleRemove(productId);
            }

            await axios.post(
                "http://localhost:5000/api/customer/cart/add",
                { productId, quantity: -1 },
                { withCredentials: true }
            );

            setCartItems((prev) =>
                prev.map((item) =>
                    item.productId._id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
            );

            calculateTotal(cartItems);
        } catch (error) {
            console.error("Failed to decrease quantity.", error);
        }
    };

    // 🔹 Remove Item
    const handleRemove = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/api/customer/cart/${productId}`, {
                withCredentials: true
            });

            const updatedCart = cartItems.filter(item => item.productId._id !== productId);
            setCartItems(updatedCart);
            calculateTotal(updatedCart);
        } catch (error) {
            console.error("Failed to remove item.", error);
            alert("Failed to remove the item. Please try again.");
        }
    };

    // 🔹 Handle Checkout
    // const handleCheckout = async () => {
    //     try {
    //         const response = await axios.post("http://localhost:5000/api/customer/cart/checkout", {}, {
    //             withCredentials: true
    //         });

    //         alert(response.data.message);
    //         setCartItems([]); // Empty Cart after successful checkout
    //         setTotalPrice(0);
    //     } catch (error) {
    //         console.error("Checkout failed.", error);
    //         alert(error.response?.data?.error || "Checkout failed.");
    //     }
    // };

    const handleCheckout = async () => {
        try {
            const { data } = await axios.post("http://localhost:5000/api/payment/create-order", 
                { amount: totalPrice }, { withCredentials: true });
                

                console.log("Order API Response:", data); 
            if (!data.success) {
                alert("Payment initialization failed.");
                return;
            }
    
            if (typeof window.Razorpay === "undefined") {
                alert("Razorpay SDK failed to load. Please refresh and try again.");
                return;
            }

            
            // Load Razorpay Payment Gateway
            const options = {
                key:"rzp_test_IIpktvB6c7nUwC", // Replace with your actual Razorpay Key ID
                amount: data.order.amount,
                currency: "INR",
                name: "Farmers Market",
                description: "Payment for your products",
                order_id: data.order.id,
                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post("http://localhost:5000/api/payment/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
    
                        if (verifyResponse.data.success) {
                            alert("Payment successful!");
                            navigate("/order-success"); // Redirect after successful payment
                        } else {
                            alert("Payment verification failed!");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        alert("Error verifying payment.");
                    }
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                },
            };
    
            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert("Error in payment process.");
        }
    };
    

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">My Cart</h1>

                {loading && <p>Loading your cart...</p>}
                {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

                {!loading && !errorMessage && cartItems.length === 0 && (
                    <p className="text-center text-gray-600">Your cart is empty.</p>
                )}

                {cartItems.length > 0 && (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {cartItems.map((item) => (
                                <div key={item.productId._id} className="border rounded-lg shadow p-4 bg-white">
                                    <img
                                        src={item.productId.image}
                                        alt={item.productId.name}
                                        className="w-full h-40 object-cover rounded"
                                    />
                                    <h2 className="text-lg font-semibold mt-2">{item.productId.name}</h2>
                                    <p className="text-sm text-gray-600">{item.productId.description}</p>
                                    <p className="text-lg font-bold">₹{item.productId.price}</p>

                                    {/* Quantity Management */}
                                    <div className="flex items-center justify-between mt-2">
                                        <button 
                                            onClick={() => decreaseQuantity(item.productId._id)} 
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            −
                                        </button>
                                        <span className="text-lg font-semibold">{item.quantity} Kg</span>
                                        <button 
                                            onClick={() => increaseQuantity(item.productId._id)} 
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove Item */}
                                    <button
                                        onClick={() => handleRemove(item.productId._id)}
                                        className="bg-gray-500 text-white px-3 py-1 rounded mt-2 hover:bg-gray-600 w-full"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Total Price & Checkout */}
                        <div className="mt-6 text-center">
                            <h2 className="text-xl font-semibold">Total: ₹{totalPrice}</h2>
                            <button
                                onClick={handleCheckout}
                                className="mt-3 bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
