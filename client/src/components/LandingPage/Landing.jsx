import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Landing = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("customer"); // Default to "customer"
  const [message, setMessage] = useState(""); // State to hold messages

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const messageFromURL = params.get("message");

    if (messageFromURL) {
      setMessage(messageFromURL); // Set the message from the URL
    }

    axios
      .get("http://localhost:5000/api/user/dashboard", { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          setUserType(res.data.user.userType);

          // Navigate after showing a success message
          if (res.data.user.userType === "farmer") {
            setMessage("Login successful! Redirecting to Farmer Home...");
            setTimeout(() => {
              navigate("/farmer-home");
            }, 2000); // 2-second delay
          } else if (res.data.user.userType === "customer") {
            setMessage("Login successful! Redirecting to Customer Home...");
            setTimeout(() => {
              navigate("/home");
            }, 2000); // 2-second delay
          }
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleGoogleAuth = () => {
    const googleAuthURL = `http://localhost:5000/auth/google?state=${JSON.stringify({
      userType,
    })}`;
    window.location.href = googleAuthURL;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to AgriConnect</h1>
      <p className="mt-2 text-gray-600">Sign up or log in to get started.</p>

      {/* Message Display */}
      {message && (
        <div className="mt-4 p-4 bg-green-100 border border-green-500 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {/* Toggle between Customer and Farmer */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => setUserType("customer")}
          className={`px-4 py-2 rounded-lg ${
            userType === "customer" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          I am a Customer
        </button>
        <button
          onClick={() => setUserType("farmer")}
          className={`px-4 py-2 rounded-lg ${
            userType === "farmer" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          I am a Farmer
        </button>
      </div>

      {/* Google Auth Button */}
      <button
        onClick={handleGoogleAuth}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Signup/Login with Google
      </button>
    </div>
  );
};

export default Landing;
