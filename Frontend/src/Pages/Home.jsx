import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="container mt-5 text-center">
      <h1>✈️ Airline Reservation System</h1>

      <h3 className="mt-4">Welcome to IndiSky</h3>

      <p className="text-success fs-5">
        Login Successful ✅
      </p>

      <button
        className="btn btn-danger mt-3"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;