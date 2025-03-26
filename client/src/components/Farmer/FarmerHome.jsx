
import { useNavigate} from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useState } from "react";
import axios from "axios";
const FarmerHome = () => {
  const navigate = useNavigate();
  const [user,setUser]=useState('')

  useEffect(() => {
    axios.get("http://localhost:5000/api/user/dashboard", { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user); // Set the logged-in user
          if (res.data.user.userType === "farmer") {
            console.log(user);
            
            navigate("/farmer-home"); // Redirect to Farmer's Home if farmer
          } else if (res.data.user.userType === "customer") {
            navigate("/home"); // Redirect to Customer's Home if customer
          }
        } else {
          navigate("/"); // Redirect to landing page if not logged in
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
        <Navbar/>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mt-6">Welcome, Farmer!</h1>
      <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Add Product */}
        <div
          className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 cursor-pointer"
          onClick={() => handleNavigation("/addProducts")}
        >
          <h2 className="text-xl font-semibold">Add Product</h2>
          <p className="mt-2">List your products for sale on the platform.</p>
        </div>

        {/* View My Products */}
        <div
          className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer"
          onClick={() => handleNavigation("/viewMyProducts")}
        >
          <h2 className="text-xl font-semibold">View My Products</h2>
          <p className="mt-2">Check and manage all your listed products.</p>
        </div>

        {/* Profile */}
        <div
          className="bg-yellow-500 text-white p-6 rounded-lg shadow-md hover:bg-yellow-600 cursor-pointer"
          onClick={() => handleNavigation("/profile")}
        >
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-2">View and update your farmer profile details.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FarmerHome;
