"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const url = categoryFilter 
          ? `/api/products?category=${encodeURIComponent(categoryFilter)}` 
          : "/api/products";
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryFilter]);

  return (
    <div className="bg-[#F7FAFC] min-h-screen pb-10">
      <div className="container-custom py-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-5">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/products">Products</Link>
          {categoryFilter && (
            <>
              <span>›</span>
              <span className="text-foreground">{categoryFilter}</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-4 hidden lg:block">
            <div className="border-t border-gray-200 py-3">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-[#1C1C1C]">Category</h4>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
              </div>
              <ul className="text-[#505050] space-y-2 text-sm">
                <li><Link href="/products?category=Electronics" className="hover:text-primary">Electronics</Link></li>
                <li><Link href="/products?category=Home & Outdoor" className="hover:text-primary">Home & Outdoor</Link></li>
                <li><Link href="/products?category=Clothing & Wear" className="hover:text-primary">Clothing & Wear</Link></li>
                <li><Link href="/products?category=Accessories" className="hover:text-primary">Accessories</Link></li>
                <li><Link href="/products" className="text-primary font-medium">All Categories</Link></li>
              </ul>
            </div>

            <div className="border-t border-gray-200 py-3">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-[#1C1C1C]">Brands</h4>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
              </div>
              <div className="space-y-2">
                {["Samsung", "Apple", "Huawei", "Pocco", "Lenovo"].map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm text-[#505050]">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span>{brand}</span>
                  </label>
                ))}
                <p className="text-primary text-sm cursor-pointer">See all</p>
              </div>
            </div>

            <div className="border-t border-gray-200 py-3">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-[#1C1C1C]">Features</h4>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
              </div>
              <div className="space-y-2">
                {["Metallic", "Plastic cover", "8GB Ram", "Super power", "Large Memory"].map((feature) => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer text-sm text-[#505050]">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 py-3">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-[#1C1C1C]">Price range</h4>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {/* Top Bar */}
            <div className="card p-4 flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <div className="text-[#1C1C1C]">
                <span>{products.length} items in </span>
                <span className="font-bold">{categoryFilter || "All categories"}</span>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-[#1C1C1C]">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Verified only</span>
                </label>
                <select className="border border-gray-300 p-2 rounded text-sm outline-none">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <div className="flex border border-gray-300 rounded overflow-hidden">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "bg-white"}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 border-l border-gray-300 ${viewMode === "list" ? "bg-gray-100" : "bg-white"}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {categoryFilter && (
              <div className="flex flex-wrap gap-2 mb-4">
                 <div className="border border-primary text-[#1C1C1C] px-3 py-1 rounded flex items-center gap-2 text-sm bg-white">
                   <span>{categoryFilter}</span>
                   <Link href="/products" className="text-gray-400 hover:text-red-500">×</Link>
                 </div>
                 <Link href="/products" className="text-primary text-sm font-medium ml-2">Clear all filter</Link>
              </div>
            )}

            {/* Product Grid */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {loading ? (
                <div className="col-span-full py-20 text-center text-[#8B96A5]">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="col-span-full py-20 text-center text-[#8B96A5]">No products found in this category.</div>
              ) : products.map((product) => (
                <div key={product._id} className={`card p-4 hover:shadow-md transition-shadow ${viewMode === "list" ? "flex gap-5" : ""}`}>
                  <Link href={`/product/${product._id}`} className={`relative block ${viewMode === "list" ? "w-48 aspect-square" : "w-full aspect-square mb-4"}`}>
                    <Image 
                      src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw" 
                      className="object-contain" 
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg text-[#1C1C1C]">${product.price}</span>
                          {product.oldPrice && <span className="text-[#8B96A5] text-sm line-through">${product.oldPrice}</span>}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-orange-400">
                             {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                          </div>
                          <span className="text-orange-400 text-sm">{product.rating}</span>
                        </div>
                      </div>
                      <button className="text-primary p-2 border border-gray-200 rounded hover:bg-gray-50">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5L12 21Z"/></svg>
                      </button>
                    </div>
                    <Link href={`/product/${product._id}`} className="text-[#505050] hover:text-primary block mb-2">{product.name}</Link>
                    {viewMode === "list" && <p className="text-[#8B96A5] text-sm mb-4">{product.description}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end mt-10 gap-2">
               <select className="border border-gray-300 p-2 rounded text-sm outline-none bg-white">
                 <option>Show 10</option>
                 <option>Show 20</option>
                 <option>Show 50</option>
               </select>
               <div className="flex border border-gray-300 rounded overflow-hidden bg-white">
                 <button className="p-2 px-4 hover:bg-gray-100 border-r border-gray-300 disabled:text-gray-300" disabled>‹</button>
                 <button className="p-2 px-4 bg-gray-100 font-bold">1</button>
                 <button className="p-2 px-4 hover:bg-gray-100 border-l border-gray-300">2</button>
                 <button className="p-2 px-4 hover:bg-gray-100 border-l border-gray-300">3</button>
                 <button className="p-2 px-4 hover:bg-gray-100 border-l border-gray-300">›</button>
               </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  return (
    <Suspense fallback={<div className="container-custom py-20 text-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
