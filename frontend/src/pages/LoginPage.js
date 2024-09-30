import React from "react";
import Login from "../components/Login";
import { loginUser } from "../services/api";

function LoginPage({ setIsAuthenticated }) {
  return (
    <div>
      <Login setIsAuthenticated={setIsAuthenticated} />
    </div>
  );
}

export default LoginPage;
