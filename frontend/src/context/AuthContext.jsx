import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setUser(null);
      setToken(null);
      return null;
    }

    try {
      const { data } = await api.get("/me");
      setUser(data);
      setToken(storedToken);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
      return null;
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      await refreshUser();
      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  const login = async (userData, tokenData) => {
    localStorage.setItem("token", tokenData);
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    await refreshUser();
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, refreshUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
