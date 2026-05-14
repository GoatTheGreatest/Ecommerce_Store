"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import Loader from "../../../components/Loader";
import NextImage from "next/image";
import { useEffect } from "react";

export default function NewProduct() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    image: "",
    category: "Electronics",
    subCategory: "",
    status: "In stock",
    supplierName: user?.name || "Admin",
    supplierRegion: "Global",
    supplierFlag: "🌐",
    supplierUrl: "store.com",
    stock: "20",
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return <div className="container-custom py-20"><Loader /></div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
          stock: parseInt(formData.stock),
          sellerName: user.name, // Automatically set admin as seller
        }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        alert("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7FAFC] min-h-screen py-10">
      <div className="container-custom max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin" className="text-primary hover:underline flex items-center gap-1 font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-[#1C1C1C] mb-8 border-b border-gray-100 pb-4">Add New Product</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Image Upload Section */}
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-[#1C1C1C] mb-4 uppercase tracking-wide">Product Image</label>
                <div className="relative group aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden hover:border-primary transition-all">
                  {imagePreview ? (
                    <NextImage src={imagePreview} alt="Preview" fill className="object-contain p-4" unoptimized />
                  ) : (
                    <div className="text-center p-4">
                       <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                       <p className="text-xs text-gray-400 font-medium">Click to upload from device</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="mt-4">
                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Or paste Image URL</p>
                   <input 
                    type="url" 
                    name="image"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary"
                   />
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="md:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Product Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Regular Price ($)</label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Sale Price ($)</label>
                    <input 
                      type="number" 
                      name="oldPrice"
                      value={formData.oldPrice}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Initial Stock</label>
                    <input 
                      type="number" 
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors font-bold text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors"
                    >
                      <option>Electronics</option>
                      <option>Home & Outdoor</option>
                      <option>Clothing & Wear</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-50">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary text-white px-12 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Adding Product...</> : "Publish Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
