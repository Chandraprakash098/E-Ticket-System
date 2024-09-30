import React from "react";
import Register from "../components/Register";

function RegisterPage({ setIsAuthenticated }) {
  return (
    <div>
      <Register setIsAuthenticated={setIsAuthenticated} />
    </div>
  );
}

export default RegisterPage;
