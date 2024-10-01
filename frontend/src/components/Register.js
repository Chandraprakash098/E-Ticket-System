import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";

function Register({ setIsAuthenticated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success messages
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate email
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    try {
      const response = await register(name, email, password);
      console.log("Registration successful:", response);
      if (setIsAuthenticated && typeof setIsAuthenticated === "function") {
        setIsAuthenticated(true);
      } else {
        console.warn("setIsAuthenticated is not a function or not provided");
      }
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
        setError(
          err.response.data.message || "Registration failed. Please try again."
        );
      } else if (err.request) {
        console.error("Error request:", err.request);
        setError("Network error. Please try again.");
      } else {
        console.error("Error message:", err.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Register
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4 text-center">{success}</p>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
