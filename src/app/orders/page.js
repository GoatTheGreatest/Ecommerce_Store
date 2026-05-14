"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import Loader from "../../components/Loader";

const MOCK_ORDERS = [
  {
    id: "ORD-99214",
    date: "Oct 12, 2023",
    status: "Delivered",
    total: 245.00,
    items: [
      { name: "iPhone 13 Pro Max", price: 999.00, quantity: 1, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80" },
      { name: "Smart Watch Silver", price: 199.99, quantity: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" }
    ]
  },
  {
    id: "ORD-88123",
    date: "Sep 28, 2023",
    status: "Shipped",
    total: 125.50,
    items: [
      { name: "Wireless Headphones", price: 99.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80" }
    ]
  },
  {
    id: "ORD-77456",
    date: "Aug 15, 2023",
    status: "Cancelled",
    total: 55.00,
    items: [
      { name: "Denim Jacket", price: 55.00, quantity: 1, image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=200&q=80" }
    ]
  }
];

export default function Orders() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div className="container-custom py-20"><Loader /></div>;
  if (!user) return null;

  const filteredOrders = activeTab === "All"
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.status === activeTab);

  return (
    <div className="bg-[#F7FAFC] min-h-screen pb-20">
      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <div className="card p-4">
              <h2 className="font-bold text-[#1C1C1C] mb-4 px-2">Account</h2>
              <div className="space-y-1">
                <Link href="/profile" className="block px-4 py-2 text-sm text-[#505050] hover:bg-blue-50 hover:text-primary rounded-lg transition-all">My Profile</Link>
                <Link href="/orders" className="block px-4 py-2 text-sm font-bold text-primary bg-blue-50 rounded-lg transition-all border-l-4 border-primary">My Orders</Link>
                <Link href="/messages" className="block px-4 py-2 text-sm text-[#505050] hover:bg-blue-50 hover:text-primary rounded-lg transition-all">Messages</Link>
                <Link href="/settings" className="block px-4 py-2 text-sm text-[#505050] hover:bg-blue-50 hover:text-primary rounded-lg transition-all">Settings</Link>
              </div>
            </div>

            <div className="card p-4">
              <h2 className="font-bold text-[#1C1C1C] mb-4 px-2">Order Filter</h2>
              <div className="space-y-1">
                {["All", "Delivered", "Shipped", "Cancelled"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-all ${activeTab === tab ? 'bg-primary text-white font-bold' : 'text-[#505050] hover:bg-gray-50'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-[#1C1C1C]">Your Orders</h1>
              <span className="text-sm text-[#8B96A5]">{filteredOrders.length} orders found</span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="card p-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                </div>
                <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">No {activeTab !== "All" ? activeTab.toLowerCase() : ""} orders yet</h3>
                <p className="text-[#8B96A5] mb-6">Looks like you haven&apos;t placed any orders in this category.</p>
                <Link href="/products" className="btn-primary">Start Shopping</Link>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="card overflow-hidden group hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 gap-4">
                    <div className="flex gap-10">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#8B96A5] tracking-wider mb-1">Order Placed</p>
                        <p className="text-sm font-medium text-[#1C1C1C]">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#8B96A5] tracking-wider mb-1">Total Amount</p>
                        <p className="text-sm font-bold text-[#1C1C1C]">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[10px] uppercase font-bold text-[#8B96A5] tracking-wider mb-1">Order ID</p>
                        <p className="text-sm font-medium text-[#1C1C1C]">{order.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                          order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                            "bg-red-100 text-red-700"
                        }`}>
                        {order.status}
                      </span>
                      <Link href={`/orders/${order.id}`} className="text-primary text-sm font-bold hover:underline">View Details</Link>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 border border-gray-100 rounded bg-white shrink-0">
                          <NextImage src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1C1C1C] truncate group-hover:text-primary transition-colors">{item.name}</p>
                          <p className="text-xs text-[#8B96A5]">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <button className="text-sm font-bold text-primary border border-primary/20 px-4 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95">
                            Buy it again
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="p-4 border-t border-gray-50 bg-white flex justify-end gap-3">
                    <button className="btn-outline text-xs py-2">Track Package</button>
                    <button className="btn-outline text-xs py-2">Leave Feedback</button>
                  </div>
                </div>
              ))
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
