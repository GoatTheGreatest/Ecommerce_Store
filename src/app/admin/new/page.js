"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    image: "",
    category: "Electronics",
    subCategory: "",
    status: "In stock",
    supplierName: "Guanjoy Trading LLC",
    supplierRegion: "Germany, Berlin",
    supplierFlag: "🇩🇪",
    supplierUrl: "shopname.ae",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-10 max-w-4xl">
      <div className="mb-8">
        <Link href="/admin" className="text-primary hover:underline flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-[#1C1C1C]">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Basic Information</h3>
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Product Name</label>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
                placeholder="e.g. Wireless Headphones"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Category</label>
              <select 
                name="category" value={formData.category} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
              >
                <option>Electronics</option>
                <option>Home & Outdoor</option>
                <option>Clothing & Wear</option>
                <option>Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Sub-category</label>
              <input 
                type="text" name="subCategory" value={formData.subCategory} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
                placeholder="e.g. Gadgets"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#505050] mb-1">Price ($)</label>
                <input 
                  type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#505050] mb-1">Old Price ($)</label>
                <input 
                  type="number" step="0.01" name="oldPrice" value={formData.oldPrice} onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Media & Status */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Media & Status</h3>
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Image URL</label>
              <input 
                type="url" name="image" required value={formData.image} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Status</label>
              <select 
                name="status" value={formData.status} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
              >
                <option>In stock</option>
                <option>Out of stock</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Description</label>
              <textarea 
                name="description" required value={formData.description} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary h-24"
                placeholder="Describe the product..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-bold text-lg">Supplier Details (Static Info)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Supplier Name</label>
              <input 
                type="text" name="supplierName" value={formData.supplierName} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Region</label>
              <input 
                type="text" name="supplierRegion" value={formData.supplierRegion} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Flag Emoji</label>
              <input 
                type="text" name="supplierFlag" value={formData.supplierFlag} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#505050] mb-1">Supplier URL</label>
              <input 
                type="text" name="supplierUrl" value={formData.supplierUrl} onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <button 
            type="button" onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" disabled={loading}
            className="bg-primary text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
