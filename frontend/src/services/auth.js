import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};


export const register = async (name, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    console.log("Registration API response:", response);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Registration API error:", error);
    throw error;
  }
};




export const logout = () => {
  localStorage.removeItem("token");
};

export const useAuth = () => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      await api.get("/users/profile");
      return true;
    } catch (error) {
      localStorage.removeItem("token");
      return false;
    }
  };

  return {
    isAuthenticated: !!localStorage.getItem("token"),
    logout,
    checkAuth,
  };
};
