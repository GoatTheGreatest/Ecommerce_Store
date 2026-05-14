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
    
    // Initialize default admins if not present
    let allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    if (allUsers.length === 0) {
      const defaultAdmins = [
        { id: "admin1", name: "TechAdmin", email: "tech@admin.com", password: "12345", phone: "+1 300 1234567", role: "admin", avatar: "", dob: "", gender: "", orders: [] },
        { id: "admin2", name: "HomeAdmin", email: "home@admin.com", password: "12345", phone: "+1 300 1234567", role: "admin", avatar: "", dob: "", gender: "", orders: [] },
        { id: "admin3", name: "FashionAdmin", email: "fashion@admin.com", password: "12345", phone: "+1 300 1234567", role: "admin", avatar: "", dob: "", gender: "", orders: [] },
        { id: "admin4", name: "AutoAdmin", email: "auto@admin.com", password: "12345", phone: "+1 300 1234567", role: "admin", avatar: "", dob: "", gender: "", orders: [] },
        { id: "admin5", name: "SportsAdmin", email: "sports@admin.com", password: "12345", phone: "+1 300 1234567", role: "admin", avatar: "", dob: "", gender: "", orders: [] },
      ];
      localStorage.setItem("allUsers", JSON.stringify(defaultAdmins));
    }

    setLoading(false);
  }, []);

  const login = (email, password) => {
    let users = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }

    const correctRole = email.toLowerCase().includes("admin") ? "admin" : "user";
    
    // For testing backwards compatibility or newly mocked non-registered ones
    const mockUser = {
      id: "1",
      name: email.split("@")[0],
      email: email,
      phone: "+92 300 1234567",
      role: correctRole,
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
    let users = JSON.parse(localStorage.getItem("allUsers") || "[]");
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return false; 
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      password: password,
      phone: phone,
      role: role,
      avatar: "",
      dob: "",
      gender: "",
      orders: []
    };
    
    users.push(newUser);
    localStorage.setItem("allUsers", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
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
