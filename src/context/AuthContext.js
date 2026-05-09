"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const mockUser = {
      id: "1",
      name: email.split("@")[0],
      email: email,
      role: email.includes("admin") ? "admin" : "user",
      avatar: "",
      dob: "",
      gender: "",
      orders: [
        { id: "ORD-001", date: "2024-03-15", total: 125.50, status: "Delivered", items: 3 },
        { id: "ORD-002", date: "2024-04-02", total: 45.00, status: "Processing", items: 1 }
      ]
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return true;
  };

  const register = (name, email, password) => {
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      role: "user",
      avatar: "",
      dob: "",
      gender: "",
      orders: []
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return true;
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
