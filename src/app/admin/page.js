"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchProducts();
  }, []);



  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return <div className="container-custom py-20"><Loader /></div>;
  }

  return (
    <div className="container-custom py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1C1C1C]">Admin Dashboard</h1>
        <div className="flex gap-4">

          <Link 
            href="/admin/history" 
            className="bg-white border-2 border-primary text-primary px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-sm"
          >
            Sales History
          </Link>
          <Link 
            href="/admin/sales" 
            className="bg-white border-2 border-primary text-primary px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-sm"
          >
            Manage Sales
          </Link>
          <Link 
            href="/admin/new" 
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-[#1C1C1C]">Product</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#1C1C1C]">Shopkeeper</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#1C1C1C]">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#1C1C1C]">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#1C1C1C]">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#1C1C1C] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-[#8B96A5]">Loading products...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-[#8B96A5]">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 border border-gray-200 rounded overflow-hidden flex-shrink-0 bg-white">
                        <Image 
                          src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"} 
                          alt={product.name} 
                          fill 
                          sizes="48px"
                          className="object-contain" 
                        />
                      </div>
                      <div>
                        <p className="font-medium text-[#1C1C1C] line-clamp-1">{product.name}</p>
                        <p className="text-xs text-[#8B96A5]">ID: {product._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#505050] font-medium">{product.sellerName || "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#505050]">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#1C1C1C]">${product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                      product.status === "In stock" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link 
                      href={`/admin/edit/${product._id}`} 
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => deleteProduct(product._id)}
                      className="text-[#EB001B] hover:underline text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
