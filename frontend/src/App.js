import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/EventPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./services/auth";
import Footer from "./components/Footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { checkAuth } = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
    };
    authCheck();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <main className="container mx-auto mt-4 p-4 flex-grow pb-16">
          <Routes>
            <Route
              path="/"
              element={<HomePage isAuthenticated={isAuthenticated} />}
            />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/login"
              element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/register"
              element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
