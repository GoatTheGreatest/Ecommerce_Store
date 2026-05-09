"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const CategorySection = ({ title, image, items, categoryName }) => (
  <section className="card overflow-hidden flex flex-col md:flex-row">
    <div className="md:w-1/4 relative min-h-[250px]">
      <NextImage src={image} alt={title} fill priority sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/5 p-6">
        <h3 className="text-xl font-bold text-[#1C1C1C] max-w-[150px] mb-4">{title}</h3>
        <Link 
          href={`/products?category=${encodeURIComponent(categoryName)}`} 
          className="bg-white text-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors shadow-sm inline-block"
        >
          Source now
        </Link>
      </div>
    </div>
    <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 border-l border-gray-100">
      {items.slice(0, 8).map((item, i) => (
        <Link 
          href={`/product/${item._id}`} 
          key={item._id} 
          className="p-4 border-r border-b border-gray-100 hover:shadow-inner transition-all flex flex-col items-center text-center group"
        >
          <div className="relative w-full aspect-square mb-2 overflow-hidden">
            <NextImage 
              src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"} 
              alt={item.name} 
              fill 
              sizes="(max-width: 768px) 25vw, 15vw" 
              className="object-contain p-2 group-hover:scale-110 transition-transform" 
            />
          </div>
          <p className="text-[#1C1C1C] text-xs line-clamp-1 group-hover:text-primary">{item.name}</p>
          <p className="text-[#8B96A5] text-[10px] mt-1">From <br/> USD {item.price}</p>
        </Link>
      ))}
    </div>
  </section>
);

export default function Home() {
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setDisplayProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const homeItems = displayProducts.filter(p => p.category === "Home & Outdoor");
  const techItems = displayProducts.filter(p => p.category === "Electronics");
  const clothingItems = displayProducts.filter(p => p.category === "Clothing & Wear");
  const accessoryItems = displayProducts.filter(p => p.category === "Accessories");

  return (
    <div className="container-custom py-5 space-y-6">
      {/* Hero Section */}
      <section className="card p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-3 hidden lg:block border-r border-gray-50 pr-4">
          <ul className="space-y-1 text-[#505050]">
            {[
              { name: "Automobiles", slug: "Automobiles" },
              { name: "Clothes and wear", slug: "Clothing & Wear" },
              { name: "Home interiors", slug: "Home & Outdoor" },
              { name: "Computer and tech", slug: "Electronics" },
              { name: "Tools, equipments", slug: "Tools" },
              { name: "Sports and outdoor", slug: "Sports" },
              { name: "Animal and pets", slug: "Pets" },
              { name: "Machinery tools", slug: "Machinery" },
              { name: "More category", slug: "" }
            ].map((cat, i) => (
              <li key={i}>
                <Link 
                  href={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className={`block px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${i === 1 ? "bg-[#E3F0FF] text-foreground font-semibold" : ""}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 relative rounded-lg overflow-hidden min-h-[360px]">
          <NextImage src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80" alt="Hero" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/10 p-10 flex flex-col justify-center">
            <h2 className="text-2xl text-[#1C1C1C]">Latest trending</h2>
            <h1 className="text-4xl font-bold text-[#1C1C1C] mb-6">Electronic items</h1>
            <Link href="/products" className="bg-white text-foreground px-4 py-2 rounded-lg font-medium w-fit hover:bg-gray-100 transition-colors shadow-sm">Learn more</Link>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-3">
          <div className="bg-[#E3F0FF] p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-white shadow-sm">
                {user ? (
                   <div className="w-full h-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                   </div>
                ) : (
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                )}
              </div>
              <p className="text-foreground text-sm">Hi, {user ? user.name.split(" ")[0] : "user"} <br/> let&apos;s get started</p>
            </div>
            {!user ? (
              <>
                <Link href="/register" className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mb-2 hover:bg-blue-700 transition-all block text-center shadow-md active:scale-95">Join now</Link>
                <Link href="/login" className="w-full bg-white text-primary py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all block text-center active:scale-95">Log in</Link>
              </>
            ) : (
              <>
                <Link href="/profile" className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mb-2 hover:bg-blue-700 transition-all block text-center shadow-md active:scale-95">View Profile</Link>
                <Link href="/orders" className="w-full bg-white text-primary py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all block text-center active:scale-95">My Orders</Link>
              </>
            )}
          </div>
          <div className="bg-[#F38332] p-4 rounded-lg text-white text-sm font-medium shadow-sm">Get US $10 off with a new supplier</div>
          <div className="bg-[#55BDC3] p-4 rounded-lg text-white text-sm font-medium shadow-sm">Send quotes with supplier preferences</div>
        </div>
      </section>

      {/* Category Sections */}
      <CategorySection title="Home and outdoor" image="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80" items={homeItems} categoryName="Home & Outdoor" />
      <CategorySection title="Consumer electronics and gadgets" image="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80" items={techItems} categoryName="Electronics" />
      
      {clothingItems.length > 0 && (
        <CategorySection title="Clothing and wear" image="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&q=80" items={clothingItems} categoryName="Clothing & Wear" />
      )}
      
      {accessoryItems.length > 0 && (
        <CategorySection title="Personal accessories" image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" items={accessoryItems} categoryName="Accessories" />
      )}

      {/* Inquiry Form */}
      <section className="relative rounded-lg overflow-hidden h-[420px]">
        <NextImage src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80" alt="Inquiry" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-blue-600/70 p-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-white max-w-lg">
            <h2 className="text-3xl font-bold mb-4">An easy way to send requests to all suppliers</h2>
            <p className="opacity-90">Get custom quotes from multiple suppliers in minutes. Fast, reliable, and secure global sourcing.</p>
          </div>
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-[#1C1C1C]">Send quote to suppliers</h3>
            <div className="space-y-4">
              <input type="text" placeholder="What item you need?" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary" />
              <textarea placeholder="Type more details" className="w-full p-2 border border-gray-300 rounded outline-none h-20 focus:border-primary resize-none"></textarea>
              <div className="flex gap-4">
                <input type="number" placeholder="Quantity" className="w-1/2 p-2 border border-gray-300 rounded outline-none focus:border-primary" />
                <select className="w-1/2 p-2 border border-gray-300 rounded outline-none bg-white">
                  <option>Pcs</option>
                  <option>Kgs</option>
                </select>
              </div>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full">Send inquiry</button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Items */}
      <section className="pb-10">
        <h3 className="text-2xl font-bold mb-6 text-[#1C1C1C]">Recommended items</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {loading ? (
            Array(10).fill(0).map((_, i) => <div key={i} className="card h-64 animate-pulse bg-gray-50"></div>)
          ) : (
            displayProducts.slice(0, 15).map((product) => (
              <Link href={`/product/${product._id}`} key={product._id} className="card p-4 hover:shadow-md transition-all group">
                <div className="relative w-full aspect-square mb-4">
                  <NextImage 
                    src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 20vw" 
                    className="object-contain group-hover:scale-105 transition-transform" 
                  />
                </div>
                <p className="font-bold text-[#1C1C1C] mb-1">${product.price}</p>
                <p className="text-[#8B96A5] text-sm line-clamp-2 group-hover:text-primary transition-colors">{product.name}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
