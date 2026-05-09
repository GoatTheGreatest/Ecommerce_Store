"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Header() {
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const [searchCategory, setSearchCategory] = useState("All category");

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Header */}
      <div className="container-custom py-5 flex items-center justify-between gap-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <span className="text-2xl font-bold text-[#8B96A5]">Brand</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-[660px] flex border-2 border-primary rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 px-4 py-2 outline-none"
          />
          <div className="relative border-l border-gray-300 px-4 py-2 bg-white flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <span>{searchCategory}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <button className="bg-primary text-white px-8 py-2 font-medium hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-5 text-[#8B96A5] text-xs">
          <Link href="/profile" className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Message</span>
          </Link>
          <Link href="/orders" className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5L12 21Z"/></svg>
            <span>Orders</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-primary transition-colors relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span>My cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Bottom Header / Nav */}
      <div className="border-t border-gray-200 py-3">
        <div className="container-custom flex items-center justify-between">
          <nav className="flex items-center gap-6 font-medium text-foreground">
            <div className="flex items-center gap-2 cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              <span>All category</span>
            </div>
            <Link href="/" className="hover:text-primary">Hot offers</Link>
            <Link href="/products" className="hover:text-primary">Gift boxes</Link>
            <Link href="/projects" className="hover:text-primary">Projects</Link>
            <Link href="/menu" className="hover:text-primary">Menu item</Link>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
              <span>Help</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </nav>

          <div className="flex items-center gap-6 font-medium text-foreground">
            <div className="flex items-center gap-1 cursor-pointer">
              <span>English, USD</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
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
