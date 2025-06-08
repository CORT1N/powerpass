import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { deriveKey } from "../utils/crypto";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (err) {
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("aesKey");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("access_token", data.access_token);
      const aesKey = await deriveKey(password, email);
      const rawKey = await window.crypto.subtle.exportKey("raw", aesKey);
      sessionStorage.setItem("aesKey", btoa(String.fromCharCode(...new Uint8Array(rawKey))));
      await fetchMe();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const register = async (email, password) => {
    try {
      await api.post("/auth/register", { email, password });
      await login(email, password);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("aesKey");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);