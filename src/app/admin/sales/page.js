"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "../../../components/Loader";
import NextImage from "next/image";

export default function SalesManagement() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [saleFilter, setSaleFilter] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Sale Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [removingProduct, setRemovingProduct] = useState(null);
  const [discount, setDiscount] = useState(10);
  const [duration, setDuration] = useState(7); // Days

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (user && user.role === "admin") {
        setProducts(data.filter(p => p.sellerName === user.name || p.supplierName === user.name));
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== "admin") {
    return <div className="container-custom py-20"><Loader /></div>;
  }

  const handleApplySale = async () => {
    if (!selectedProduct) return;

    const originalPrice = selectedProduct.oldPrice || selectedProduct.price;
    const newPrice = originalPrice * (1 - discount / 100);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(duration));

    try {
      const res = await fetch(`/api/products/${selectedProduct._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: newPrice.toFixed(2),
          oldPrice: originalPrice.toFixed(2),
          discountPercent: discount,
          saleEndDate: endDate
        })
      });

      if (res.ok) {
        fetchProducts();
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error("Error applying sale:", error);
    }
  };

  const handleRemoveSale = async () => {
    if (!removingProduct) return;
    
    try {
      const res = await fetch(`/api/products/${removingProduct._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: removingProduct.oldPrice,
          oldPrice: null,
          discountPercent: 0,
          saleEndDate: null
        })
      });

      if (res.ok) {
        fetchProducts();
        setRemovingProduct(null);
      }
    } catch (error) {
      console.error("Error removing sale:", error);
    }
  };

  const filteredProducts = products.filter(p => {
    if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
    if (saleFilter === "On Sale" && !p.oldPrice) return false;
    if (saleFilter === "Regular" && p.oldPrice) return false;
    if (minPrice && p.price < parseFloat(minPrice)) return false;
    if (maxPrice && p.price > parseFloat(maxPrice)) return false;
    return true;
  });

  return (
    <div className="bg-[#F7FAFC] min-h-screen py-10">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-[#1C1C1C]">Sales Management</h1>
             <p className="text-[#8B96A5] text-sm">Schedule discounts and manage promotional pricing</p>
          </div>
          <Link href="/admin" className="btn-outline">Back to Dashboard</Link>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
           <div>
              <label className="block text-[10px] font-bold text-[#8B96A5] uppercase mb-2">Category</label>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary text-sm"
              >
                <option>All</option>
                <option>Electronics</option>
                <option>Home & Outdoor</option>
                <option>Clothing & Wear</option>
                <option>Accessories</option>
              </select>
           </div>
           <div>
              <label className="block text-[10px] font-bold text-[#8B96A5] uppercase mb-2">Sale Status</label>
              <select 
                value={saleFilter} 
                onChange={(e) => setSaleFilter(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary text-sm"
              >
                <option>All</option>
                <option>On Sale</option>
                <option>Regular</option>
              </select>
           </div>
           <div className="md:col-span-2 flex gap-4">
              <div className="flex-1">
                 <label className="block text-[10px] font-bold text-[#8B96A5] uppercase mb-2">Price Range</label>
                 <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                    <span className="text-gray-400">-</span>
                    <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                 </div>
              </div>
           </div>
        </div>

        {/* Products Table */}
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-[#8B96A5] uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8B96A5] uppercase">Current Price</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8B96A5] uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8B96A5] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div></td></tr>
              ) : filteredProducts.map(product => (
                <tr key={product._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 border border-gray-200 rounded bg-white p-1">
                          <NextImage src={product.image} alt={product.name} width={40} height={40} className="object-contain" unoptimized />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-[#1C1C1C]">{product.name}</p>
                          <p className="text-[10px] text-[#8B96A5]">{product.category}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.oldPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1C1C1C]">${product.price}</span>
                        <span className="text-xs text-red-500 line-through decoration-red-500 decoration-dashed decoration-1">
                          ${product.oldPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-[#1C1C1C]">${product.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     {product.oldPrice ? (
                       <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                         -{product.discountPercent || Math.round((1 - (product.price / product.oldPrice)) * 100)}% OFF
                       </span>
                     ) : (
                       <span className="text-[#8B96A5] text-[10px] font-bold uppercase">No Sale</span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {product.oldPrice && (
                      <button 
                        onClick={() => setRemovingProduct(product)}
                        className="bg-red-50 text-red-500 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        Remove Sale
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setDiscount(product.discountPercent || 10);
                        setSelectedProduct(product);
                      }}
                      className="bg-white border border-primary text-primary text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      {product.oldPrice ? "Update Sale" : "Set Sale"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-black text-[#1C1C1C] mb-2">Apply Discount</h2>
              <p className="text-[#8B96A5] text-sm mb-6">Set a sale price for <strong>{selectedProduct.name}</strong></p>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-[#1C1C1C] uppercase mb-2">Discount Percentage (%)</label>
                    <div className="flex items-center gap-4">
                       <input 
                        type="range" 
                        min="5" 
                        max="90" 
                        step="5" 
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="flex-1 accent-primary h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                       />
                       <span className="w-12 text-center font-black text-primary bg-blue-50 py-1 rounded-lg">{discount}%</span>
                    </div>
                 </div>

                 <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Original Price</span>
                       <span className="font-bold text-[#1C1C1C]">${(selectedProduct.oldPrice || selectedProduct.price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                       <span className="font-bold text-[#1C1C1C]">New Sale Price</span>
                       <span className="font-black text-red-500">${((selectedProduct.oldPrice || selectedProduct.price) * (1 - discount/100)).toFixed(2)}</span>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-[#1C1C1C] uppercase mb-2">Sale Duration (Days)</label>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-[#1C1C1C] outline-none focus:border-primary"
                    >
                      <option value="1">1 Day</option>
                      <option value="3">3 Days</option>
                      <option value="7">1 Week</option>
                      <option value="14">2 Weeks</option>
                      <option value="30">1 Month</option>
                      <option value="365">Custom (1 Year)</option>
                    </select>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setSelectedProduct(null)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                    <button onClick={handleApplySale} className="flex-1 py-3 font-bold bg-primary text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95">Apply Sale</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Remove Sale Confirmation Modal */}
      {removingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🔔</div>
              <h3 className="text-xl font-black text-[#1C1C1C] mb-2">End Sale?</h3>
              <p className="text-[#8B96A5] text-sm mb-8 leading-relaxed">
                Are you sure you want to end the sale for <strong>{removingProduct.name}</strong>? The price will revert to its original value of <strong>${removingProduct.oldPrice}</strong>.
              </p>
              
              <div className="flex gap-4">
                 <button onClick={() => setRemovingProduct(null)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                 <button onClick={handleRemoveSale} className="flex-1 py-3 font-bold bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-700 transition-all active:scale-95">End Sale</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
