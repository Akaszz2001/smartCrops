

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Navbar from "../Navbar/Navbar";

// const ViewProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/farmers/myProducts", {
//           withCredentials: true, // Include cookies for Passport.js authentication
//         });

//         setProducts(response.data.data);
//       } catch (error) {
//         console.error(error);
//         setErrorMessage(
//           error.response?.data?.error || "Failed to fetch your products."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div>
//       <Navbar />
//       <div className="max-w-4xl mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-4">My Products</h1>
//         {loading && <p>Loading your products...</p>}
//         {errorMessage && <p className="text-red-600">{errorMessage}</p>}
//         {!loading && !errorMessage && products.length === 0 && (
//           <p>No products found. Start adding some!</p>
//         )}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {products.map((product) => (
//             <div
//               key={product._id}
//               className="border rounded-lg shadow p-4 flex flex-col items-center"
//             >
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="w-full h-40 object-cover rounded"
//               />
//               <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
//               <p className="text-sm text-gray-600">{product.description}</p>
//               <p className="text-lg font-bold mt-2">₹{product.price}</p>
//               <p className="text-sm text-gray-600">Type: {product.cropType}</p>
//               <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewProducts;
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/farmers/myProducts", {
          withCredentials: true, // Include cookies for Passport.js authentication
        });

        setProducts(response.data.data);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error.response?.data?.error || "Failed to fetch your products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ➤ ADD TO CART FUNCTION


  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Products</h1>
        {loading && <p>Loading your products...</p>}
      
        {!loading && !errorMessage && products.length === 0 && (
          <p>No products found. Start adding some!</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-lg font-bold mt-2">₹{product.price}</p>
              <p className="text-sm text-gray-600">Type: {product.cropType}</p>
              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>

              {/* Add to Cart Button */}
           
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;
