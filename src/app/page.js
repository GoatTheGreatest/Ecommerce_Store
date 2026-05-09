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
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const deals = products.slice(0, 5);
  const recommended = products.slice(0, 10);
  
  const homeItems = products.filter(p => p.category === "Home & Outdoor").slice(0, 8);
  const techItems = products.filter(p => p.category === "Electronics").slice(0, 8);

  return (
    <div className="container-custom py-5 space-y-6">
      {/* Hero Section */}
      <section className="card p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 hidden lg:block">
          <ul className="space-y-1 text-[#505050]">
            <li className="bg-[#E3F0FF] text-foreground font-semibold px-3 py-2 rounded-lg cursor-pointer">Automobiles</li>
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">Clothes and wear</li>
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">Home interiors</li>
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">Computer and tech</li>
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">Tools, equipments</li>
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">Sports and outdoor</li>
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">Animal and pets</li>
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">Machinery tools</li>
            <li className="px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100">More category</li>
          </ul>
        </div>

        {/* Hero Banner */}
        <div className="lg:col-span-6 relative rounded-lg overflow-hidden min-h-[360px]">
          <Image 
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80" 
            alt="Hero Banner" 
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10 p-10 flex flex-col justify-center">
            <h2 className="text-2xl text-[#1C1C1C]">Latest trending</h2>
            <h1 className="text-4xl font-bold text-[#1C1C1C] mb-6">Electronic items</h1>
            <button className="bg-white text-foreground px-4 py-2 rounded-lg font-medium w-fit hover:bg-gray-100 transition-colors shadow-sm">
              Learn more
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-[#E3F0FF] p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-[#BDC4CD] rounded-full"></div>
              <p className="text-foreground">Hi, user <br/> let&apos;s get started</p>
            </div>
            <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mb-2 hover:bg-blue-700 transition-colors">Join now</button>
            <button className="w-full bg-white text-primary py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">Log in</button>
          </div>
          <div className="bg-[#F38332] p-4 rounded-lg text-white">
            <p className="text-sm">Get US $10 off with a new supplier</p>
          </div>
          <div className="bg-[#55BDC3] p-4 rounded-lg text-white">
            <p className="text-sm">Send quotes with supplier preferences</p>
          </div>
        </div>
      </section>

      {/* Deals and Offers */}
      <section className="card flex flex-col md:flex-row overflow-hidden">
        <div className="p-5 border-r border-gray-200 flex flex-col justify-between min-w-[280px]">
          <div>
            <h3 className="text-xl font-bold mb-1">Deals and offers</h3>
            <p className="text-[#8B96A5]">Hygiene equipments</p>
          </div>
          <div className="flex gap-2">
            {[ {v: '04', l:'Days'}, {v: '13', l:'Hour'}, {v: '34', l:'Min'}, {v: '56', l:'Sec'} ].map((t, i) => (
              <div key={i} className="bg-[#494949] text-white p-2 rounded flex flex-col items-center w-12">
                <span className="font-bold">{t.v}</span>
                <span className="text-[10px]">{t.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-gray-200">
          {deals.map((product) => (
            <Link href={`/product/${product._id}`} key={product._id} className="p-5 flex flex-col items-center text-center hover:bg-gray-50 transition-colors">
              <div className="relative w-32 h-32 mb-3">
                <Image src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"} alt={product.name} fill sizes="128px" className="object-contain" />
              </div>
              <p className="text-sm mb-2 line-clamp-1">{product.name}</p>
              <span className="bg-[#FFE3E3] text-[#EB001B] px-3 py-1 rounded-full text-xs font-semibold">
                -25%
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Sections */}
      <CategorySection 
        title="Home and outdoor" 
        image="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80" 
        items={homeItems} 
        categoryName="Home & Outdoor"
      />
      <CategorySection 
        title="Consumer electronics and gadgets" 
        image="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&q=80" 
        items={techItems} 
        categoryName="Electronics"
      />

      {/* Inquiry Form */}
      <section className="relative rounded-lg overflow-hidden h-[420px]">
        <Image src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80" alt="Inquiry" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-blue-600/70 p-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-white max-w-lg">
            <h2 className="text-3xl font-bold mb-4">An easy way to send requests to all suppliers</h2>
            <p className="hidden md:block">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.</p>
          </div>
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-[#1C1C1C]">Send quote to suppliers</h3>
            <div className="space-y-4">
              <input type="text" placeholder="What item you need?" className="w-full p-2 border border-gray-300 rounded outline-none" />
              <textarea placeholder="Type more details" className="w-full p-2 border border-gray-300 rounded outline-none h-20"></textarea>
              <div className="flex gap-2">
                <input type="text" placeholder="Quantity" className="w-1/2 p-2 border border-gray-300 rounded outline-none" />
                <select className="w-1/2 p-2 border border-gray-300 rounded outline-none">
                  <option>Pcs</option>
                  <option>Kgs</option>
                </select>
              </div>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Send inquiry</button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Items */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-[#1C1C1C]">Recommended items</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {recommended.map((product) => (
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

      {/* Extra Services */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-[#1C1C1C]">Our extra services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Source from Industry Hubs", icon: "🏢", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&q=80" },
            { title: "Customize Your Products", icon: "🎨", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&q=80" },
            { title: "Fast, reliable shipping", icon: "✈️", image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=300&q=80" },
            { title: "Product monitoring and inspection", icon: "🛡️", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&q=80" }
          ].map((service, i) => (
            <div key={i} className="card overflow-hidden group">
              <div className="relative h-32">
                <Image src={service.image} alt={service.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute -bottom-5 right-5 w-12 h-12 bg-[#E3F0FF] rounded-full border-2 border-white flex items-center justify-center text-xl shadow-md">
                  {service.icon}
                </div>
              </div>
              <div className="p-5 pt-8">
                <p className="font-medium text-[#1C1C1C] group-hover:text-primary transition-colors">{service.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suppliers by Region */}
      <section>
        <h3 className="text-2xl font-bold mb-6 text-[#1C1C1C]">Suppliers by region</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-4">
          {[
            { name: "Arabic Emirates", flag: "🇦🇪", url: "shopname.ae" },
            { name: "Australia", flag: "🇦🇺", url: "shopname.ae" },
            { name: "United States", flag: "🇺🇸", url: "shopname.ae" },
            { name: "Russia", flag: "🇷🇺", url: "shopname.ae" },
            { name: "Italy", flag: "🇮🇹", url: "shopname.ae" },
            { name: "Denmark", flag: "🇩🇰", url: "shopname.ae" },
            { name: "France", flag: "🇫🇷", url: "shopname.ae" },
            { name: "Arabic Emirates", flag: "🇦🇪", url: "shopname.ae" },
            { name: "China", flag: "🇨🇳", url: "shopname.ae" },
            { name: "Great Britain", flag: "🇬🇧", url: "shopname.ae" }
          ].map((region, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-2xl">{region.flag}</span>
              <div>
                <p className="text-sm text-[#1C1C1C]">{region.name}</p>
                <p className="text-xs text-[#8B96A5]">{region.url}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#EFF2F4] p-10 rounded-lg text-center mt-10">
        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">Subscribe on our newsletter</h3>
        <p className="text-[#606060] mb-6">Get daily news on upcoming offers from many suppliers all over the world</p>
        <div className="flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto">
          <input type="email" placeholder="Email" className="flex-1 p-2 border border-gray-300 rounded outline-none" />
          <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Subscribe</button>
        </div>
      </section>
    </div>
  );
}
