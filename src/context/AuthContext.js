"use client";
// CLEAN FIX - ADDING PHONE SUPPORT

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
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.email === email) {
        setUser(parsed);
        return true;
      }
    }
    
    const mockUser = {
      id: "1",
      name: email.split("@")[0],
      email: email,
      phone: "+92 300 1234567", // Default mock phone
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

  const register = (name, email, password, role = "user", phone = "") => {
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      phone: phone,
      role: role,
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
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const checkout = async (items) => {
    try {
      for (const item of items) {
        await fetch(`/api/products/${item._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stock: Math.max(0, (item.stock || 0) - item.quantity)
          })
        });
      }
        
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
          user: { name: user.name, email: user.email },
          items: items.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        })
      });

      if (!orderRes.ok) console.error("Failed to save order record");

      return true;
    } catch (error) {
      console.error("Checkout error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, checkout, loading }}>
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
