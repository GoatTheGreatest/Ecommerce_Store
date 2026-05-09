"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import NextImage from "next/image";

const CATEGORIES = [
  "All category",
  "Electronics",
  "Home & Outdoor",
  "Clothing & Wear",
  "Accessories",
  "Automobiles",
  "Tools",
  "Sports",
  "Pets",
  "Machinery"
];

export default function Header() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const [searchCategory, setSearchCategory] = useState("All category");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Hide header on login and register pages
  if (pathname === "/login" || pathname === "/register") return null;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let url = "/products";
    const params = new URLSearchParams();
    
    if (searchQuery) params.append("q", searchQuery);
    if (searchCategory !== "All category") params.append("category", searchCategory);
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
    
    router.push(url);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Header */}
      <div className="container-custom py-4 flex items-center justify-between gap-6 md:gap-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <span className="text-2xl font-bold text-[#8B96A5] hidden sm:block">Brand</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[660px] hidden md:flex border-2 border-primary rounded-lg shadow-sm relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 outline-none text-[#1C1C1C]"
          />
          
          {/* Category Dropdown (Hover-based) */}
          <div className="relative border-l border-gray-300 px-4 py-2 bg-white flex items-center gap-2 cursor-pointer group whitespace-nowrap text-[#505050] hover:bg-gray-50 transition-colors">
            <span>{searchCategory}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"/></svg>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-0 w-48 bg-white rounded-b-lg shadow-xl border border-gray-100 py-2 z-[60] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {CATEGORIES.map(cat => (
                <div 
                  key={cat}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchCategory(cat);
                  }}
                  className={`px-4 py-2 text-sm hover:bg-gray-50 hover:text-primary transition-colors ${searchCategory === cat ? 'text-primary font-bold bg-blue-50' : 'text-[#505050]'}`}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>
          
          <button type="submit" className="bg-primary text-white px-8 py-2 font-medium hover:bg-blue-700 transition-all active:scale-95">
            Search
          </button>
        </form>

        {/* User Actions */}
        <div className="flex items-center gap-4 md:gap-6 text-[#8B96A5] text-xs">
          {user ? (
            <div className="relative group">
              <button 
                className="flex flex-col items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold text-[10px] overflow-hidden">
                  {user.avatar ? (
                    <NextImage src={user.avatar} alt="Avatar" width={24} height={24} className="object-cover" unoptimized={user.avatar.startsWith('data:')} />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span>{user.name?.split(" ")[0]}</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-[#1C1C1C] font-bold text-sm truncate">{user.name}</p>
                  <p className="text-[#8B96A5] text-[10px] truncate">{user.email}</p>
                  {user.role === "admin" && <span className="inline-block mt-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-[9px] font-bold">ADMIN</span>}
                </div>
                <Link href="/profile" className="block px-4 py-2 text-sm text-[#505050] hover:bg-gray-50 hover:text-primary transition-colors">My Profile</Link>
                <Link href="/orders" className="block px-4 py-2 text-sm text-[#505050] hover:bg-gray-50 hover:text-primary transition-colors">My Orders</Link>
                {user.role === "admin" && <Link href="/admin" className="block px-4 py-2 text-sm text-primary font-semibold hover:bg-gray-50 transition-colors">Admin Panel</Link>}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Sign in</span>
            </Link>
          )}
          
          <Link href="/messages" className="hidden sm:flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Message</span>
          </Link>
          <Link href="/orders" className="hidden sm:flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5L12 21Z"/></svg>
            <span>Orders</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-primary transition-colors relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span>My cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center border border-white font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Bottom Header / Nav */}
      <div className="border-t border-gray-200 py-3 hidden md:block">
        <div className="container-custom flex items-center justify-between">
          <nav className="flex items-center gap-6 font-medium text-[#1C1C1C] text-sm">
            {/* Main All Category Button with Hover Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors py-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                <span>All category</span>
              </div>
              
              {/* Nav Dropdown */}
              <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-b-lg shadow-2xl border border-gray-100 py-3 z-[60] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {CATEGORIES.slice(1).map(cat => (
                  <Link 
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="flex items-center justify-between px-5 py-2.5 text-sm text-[#505050] hover:bg-blue-50 hover:text-primary transition-all group/item"
                  >
                    <span>{cat}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-0 group-hover/item:opacity-100 transition-opacity"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/" className="hover:text-primary transition-colors">Hot offers</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Gift boxes</Link>
            <Link href="/menu" className="hover:text-primary transition-colors">Menu item</Link>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
              <span>Help</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </nav>

          <div className="flex items-center gap-6 font-medium text-[#1C1C1C] text-sm">
            <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <span>English, USD</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <span>Ship to</span>
              <span className="text-xl">🇩🇪</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
