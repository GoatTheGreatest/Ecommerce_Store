"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import CategorySection from "../components/CategorySection";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("API returned non-array data:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fallback static items - Matching the reference image content as closely as possible
  const staticHomeItems = [
    { name: "Soft chairs", price: 19, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80", sub: "Furniture" },
    { name: "Sofa & chair", price: 19, image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=200&q=80", sub: "Furniture" }, // Table lamp
    { name: "Kitchen dishes", price: 19, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&q=80", sub: "Kitchen" }, // Bed/Mattress
    { name: "Smart watches", price: 19, image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=200&q=80", sub: "Gadgets" }, // Brown pot
    { name: "Kitchen mixer", price: 100, image: "https://images.unsplash.com/photo-1585533880150-10489b486211?w=200&q=80", sub: "Kitchen" }, // Meat grinder
    { name: "Blenders", price: 39, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&q=80", sub: "Appliances" }, // Coffee machine
    { name: "Home appliance", price: 19, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&q=80", sub: "Appliances" }, // Storage/Organizer
    { name: "Coffee maker", price: 10, image: "https://images.unsplash.com/photo-1512428559083-a400a4b82c9a?w=200&q=80", sub: "Appliances" }, // Potted plant
  ];

  const staticTechItems = [
    { name: "Smart watches", price: 19, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80", sub: "Gadgets" },
    { name: "Cameras", price: 89, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80", sub: "Cameras" },
    { name: "Headphones", price: 15, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80", sub: "Gadgets" },
    { name: "Smart watches", price: 90, image: "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=200&q=80", sub: "Gadgets" }, // Kettle
    { name: "Gaming set", price: 35, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80", sub: "Gadgets" },
    { name: "Laptops & PC", price: 340, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80", sub: "Laptops" },
    { name: "Smartphones", price: 19, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80", sub: "Gadgets" }, // Tablet
    { name: "Electric kattle", price: 240, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80", sub: "Appliances" }, // Phone
  ];

  const displayProducts = Array.isArray(products) && products.length > 0 ? products : [];
  
  const dbHomeItems = Array.isArray(products) ? products.filter(p => p.category === "Home & Outdoor").slice(0, 8) : [];
  const dbTechItems = Array.isArray(products) ? products.filter(p => p.category === "Electronics").slice(0, 8) : [];

  const homeItems = dbHomeItems.length > 0 ? dbHomeItems : staticHomeItems;
  const techItems = dbTechItems.length > 0 ? dbTechItems : staticTechItems;

  if (loading) {
    return <div className="container-custom py-20 text-center text-[#8B96A5]">Loading...</div>;
  }

  return (
    <div className="container-custom py-5 space-y-6">
      {/* Hero Section */}
      <section className="card p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-3 hidden lg:block">
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
                  href={`/products?category=${cat.slug}`}
                  className={`block px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 ${i === 0 ? "bg-[#E3F0FF] text-foreground font-semibold" : ""}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 relative rounded-lg overflow-hidden min-h-[360px]">
          <Image src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80" alt="Hero" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/10 p-10 flex flex-col justify-center">
            <h2 className="text-2xl text-[#1C1C1C]">Latest trending</h2>
            <h1 className="text-4xl font-bold text-[#1C1C1C] mb-6">Electronic items</h1>
            <Link href="/products" className="bg-white text-foreground px-4 py-2 rounded-lg font-medium w-fit hover:bg-gray-100 transition-colors shadow-sm">Learn more</Link>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-3">
          <div className="bg-[#E3F0FF] p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-[#BDC4CD] rounded-full"></div>
              <p className="text-foreground text-sm">Hi, user <br/> let&apos;s get started</p>
            </div>
            <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mb-2 hover:bg-blue-700 transition-colors">Join now</button>
            <button className="w-full bg-white text-primary py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">Log in</button>
          </div>
          <div className="bg-[#F38332] p-4 rounded-lg text-white text-sm">Get US $10 off with a new supplier</div>
          <div className="bg-[#55BDC3] p-4 rounded-lg text-white text-sm">Send quotes with supplier preferences</div>
        </div>
      </section>

      {/* Category Sections */}
      <CategorySection title="Home and outdoor" image="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80" items={homeItems} categoryName="Home & Outdoor" />
      <CategorySection title="Consumer electronics and gadgets" image="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80" items={techItems} categoryName="Electronics" />

      {/* Inquiry Form */}
      <section className="relative rounded-lg overflow-hidden h-[420px]">
        <Image src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80" alt="Inquiry" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-blue-600/70 p-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-white max-w-lg">
            <h2 className="text-3xl font-bold mb-4">An easy way to send requests to all suppliers</h2>
          </div>
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-[#1C1C1C]">Send quote to suppliers</h3>
            <div className="space-y-4">
              <input type="text" placeholder="What item you need?" className="w-full p-2 border border-gray-300 rounded outline-none" />
              <textarea placeholder="Type more details" className="w-full p-2 border border-gray-300 rounded outline-none h-20"></textarea>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Send inquiry</button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Items */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-[#1C1C1C]">Recommended items</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {displayProducts.slice(0, 10).map((product) => (
            <Link href={`/product/${product._id}`} key={product._id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="relative w-full aspect-square mb-4">
                <Image src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"} alt={product.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-contain" />
              </div>
              <p className="font-bold text-[#1C1C1C] mb-1">${product.price}</p>
              <p className="text-[#8B96A5] text-sm line-clamp-2">{product.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#EFF2F4] p-10 rounded-lg text-center mt-10">
        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">Subscribe on our newsletter</h3>
        <p className="text-[#606060] mb-6">Get daily news on upcoming offers</p>
        <div className="flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto">
          <input type="email" placeholder="Email" className="flex-1 p-2 border border-gray-300 rounded outline-none" />
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Subscribe</button>
        </div>
      </section>
    </div>
  );
}
