import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

function Home() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      axios.get("http://localhost:5000/api/user/dashboard", { withCredentials: true })
        .then((res) => {
          if (res.data.user) {
            setUser(res.data.user); // Set the logged-in user
            if (res.data.user.userType === "farmer") {
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
    if (!user) return <p>Loading...</p>;
  return (
    <div>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 text-gray-800">


   
    <section
  className="relative container mx-auto flex flex-col-reverse lg:flex-row items-center py-16 px-6"
  style={{
    backgroundImage: "url('https://img.freepik.com/premium-photo/modern-smart-farm-controlled-by-technology-farmers-is-monitoring-growth-trees-plots_10221-16499.jpg?w=826')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
 
  <div className="absolute inset-0 bg-black bg-opacity-50"></div>


  <div className="relative lg:w-1/2 z-10 text-white">
    <h2 className="text-4xl font-bold leading-snug">
      Empowering Farmers with Technology
    </h2>
    <p className="mt-4">
      Discover the best crops to grow, sell your produce directly to customers, and get
      soil health reports with ease. AgriConnect bridges the gap between farmers, buyers,
      and cutting-edge agricultural solutions.
    </p>
    <div className="mt-6">
      <a
        href="/get-started"
        className="px-6 py-3 bg-green-600 text-white text-lg rounded hover:bg-green-700"
      >
        Get Started
      </a>
    </div>
  </div>
  <div className="relative lg:w-1/2 z-10 flex justify-center items-center">
   
  </div>
</section>



   
    <section id="features" className="bg-white py-16">
      <div className="container mx-auto px-6">
        <h3 className="text-3xl font-bold text-center text-green-600">Our Features</h3>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="p-6 bg-gray-100 rounded shadow">
            <h4 className="text-xl font-bold text-green-600">Soil Testing</h4>
            <p className="mt-2 text-gray-700">
              Analyze soil health using our advanced testing kits integrated with the platform.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded shadow">
            <h4 className="text-xl font-bold text-green-600">Crop Prediction</h4>
            <p className="mt-2 text-gray-700">
              Get personalized recommendations on the best crops to grow based on your soil data.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded shadow">
            <h4 className="text-xl font-bold text-green-600">Market Access</h4>
            <p className="mt-2 text-gray-700">
              Sell your products directly to customers and gain better market insights.
            </p>
          </div>
        </div>
      </div>
    </section>

   
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 AgriConnect. All rights reserved.</p>
      </div>
    </footer>
  </div>
  </div>
  )
}

export default Home
