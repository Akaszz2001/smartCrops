import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const CustomerProductView = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [cartItems, setCartItems] = useState({}); // Track quantity of each product in cart

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/user/viewAllProducts", {
                    withCredentials: true
                });
                setProducts(response.data.data);
            } catch (error) {
                console.error(error);
                setErrorMessage(error.response?.data?.error || "Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        const fetchCart = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/customer/cart", {
                    withCredentials: true
                });

                // Map cart items to local state
                const cartData = {};
                response.data.data.forEach(item => {
                    cartData[item.productId._id] = item.quantity;
                });
                setCartItems(cartData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
        fetchCart();
    }, []);

    // ➤ Add to Cart
    const addToCart = async (productId) => {
        try {
            await axios.post(
                "http://localhost:5000/api/customer/cart/add",
                { productId, quantity: 1 },
                { withCredentials: true }
            );

            setCartItems(prev => ({ ...prev, [productId]: 1 }));
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to add product to cart.");
        }
    };

    // ➤ Increase Quantity
    const increaseQuantity = async (productId) => {
        try {
            const newQuantity = cartItems[productId] + 1;
            await axios.post(
                "http://localhost:5000/api/customer/cart/add",
                { productId, quantity: 1 }, // Increase quantity by 1
                { withCredentials: true }
            );

            setCartItems(prev => ({ ...prev, [productId]: newQuantity }));
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to update quantity.");
        }
    };

    // ➤ Decrease Quantity
    const decreaseQuantity = async (productId) => {
        try {
            const newQuantity = cartItems[productId] - 1;

            if (newQuantity === 0) {
                // Remove item from cart
                await axios.delete(`http://localhost:5000/api/customer/cart/${productId}`, { withCredentials: true });
                const updatedCart = { ...cartItems };
                delete updatedCart[productId]; // Remove item from local state
                setCartItems(updatedCart);
            } else {
                await axios.post(
                    "http://localhost:5000/api/customer/cart/add",
                    { productId, quantity: -1 }, // Decrease quantity by 1
                    { withCredentials: true }
                );

                setCartItems(prev => ({ ...prev, [productId]: newQuantity }));
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to update quantity.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Available Products in Your District</h1>
                
                {/* Loading Spinner */}
                {loading && (
                    <div className="flex justify-center items-center py-5">
                        <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

                {/* No Products Available */}
                {!loading && !errorMessage && products.length === 0 && (
                    <p className="text-center text-gray-600">No products available in your district.</p>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="border rounded-lg shadow-lg p-4 bg-white">
                            <img 
                                src={product.image || "/placeholder.jpg"} 
                                alt={product.name} 
                                className="w-full h-40 object-cover rounded-lg"
                            />
                            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <p className="text-lg font-bold">₹{product.price}</p>
                            <p className="text-sm text-gray-500">Farmer: <span className="font-medium">{product.farmerName}</span></p>
                            
                            {/* Show Add to Cart OR Quantity Adjuster */}
                            {cartItems[product._id] ? (
                                <div className="flex items-center justify-between mt-2">
                                    <button 
                                        onClick={() => decreaseQuantity(product._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                                    >
                                        −
                                    </button>
                                    <span className="text-lg font-semibold">{cartItems[product._id]} kg</span>
                                    <button 
                                        onClick={() => increaseQuantity(product._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => addToCart(product._id)}
                                    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerProductView;


