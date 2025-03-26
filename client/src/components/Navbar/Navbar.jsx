import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        window.location.href = res.data.redirect;
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/dashboard", { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          navigate("/");
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleHomeRedirect = () => {
    if (!user) {
      navigate("/");
    } else if (user.userType === "customer") {
      navigate("/");
    } else if (user.userType === "farmer") {
      navigate("/farmer-home");
    }
  };

  return (
    <header className="bg-green-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={handleHomeRedirect}
        >
          SMART CROPS
        </h1>
        <nav className="hidden md:flex space-x-6 top-3">
          {user && user.userType === "customer" && (
            <a href="/viewProducts" className="hover:text-gray-300">Market</a>
          )}
          <a href="/profile" className="hover:text-gray-300">Profile</a>
          {user ? (
            <>
              <a
                href="/login"
                className="px-4 py-2 bg-white text-green-600 rounded hover:bg-gray-200"
              >
                {user.displayName}
              </a>
              {user.userType === "customer" && (
                <a
                  href="/cart"
                  className="px-4 py-2 bg-white text-green-600 rounded hover:bg-gray-200"
                >
                  Cart
                </a>
              )}
              <a
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-green-600 rounded hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </a>
            </>
          ) : (
            <a
              href="/login"
              className="px-4 py-2 bg-white text-green-600 rounded hover:bg-gray-200"
            >
              Login
            </a>
          )}
        </nav>
        <button className="md:hidden flex items-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
