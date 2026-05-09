"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "../../../components/Loader";
import NextImage from "next/image";

export default function SalesHistory() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Today"); // Today, All

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filter === "Today" ? "/api/orders?today=true" : "/api/orders";
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div className="bg-[#F7FAFC] min-h-screen py-10">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-[#1C1C1C]">Sales History</h1>
             <p className="text-[#8B96A5] text-sm">Track your store&apos;s daily performance and revenue</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                <button 
                  onClick={() => setFilter("Today")}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === "Today" ? "bg-primary text-white shadow-sm" : "text-[#505050] hover:bg-gray-50"}`}
                >
                  Today
                </button>
                <button 
                  onClick={() => setFilter("All")}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === "All" ? "bg-primary text-white shadow-sm" : "text-[#505050] hover:bg-gray-50"}`}
                >
                  All History
                </button>
             </div>
             <Link href="/admin" className="btn-outline">Back to Dashboard</Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="card p-6 border-b-4 border-primary">
              <p className="text-[10px] font-bold text-[#8B96A5] uppercase tracking-widest mb-1">Total Orders</p>
              <h3 className="text-3xl font-black text-[#1C1C1C]">{orders.length}</h3>
           </div>
           <div className="card p-6 border-b-4 border-green-500">
              <p className="text-[10px] font-bold text-[#8B96A5] uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-[#1C1C1C]">${totalRevenue.toFixed(2)}</h3>
           </div>
           <div className="card p-6 border-b-4 border-orange-500">
              <p className="text-[10px] font-bold text-[#8B96A5] uppercase tracking-widest mb-1">Items Sold</p>
              <h3 className="text-3xl font-black text-[#1C1C1C]">{totalItems}</h3>
           </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
           {loading ? (
             <div className="p-20 text-center"><Loader /></div>
           ) : orders.length === 0 ? (
             <div className="card p-20 text-center flex flex-col items-center">
                <div className="text-5xl mb-4 text-gray-200">📊</div>
                <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">No sales recorded {filter === "Today" ? "today" : "yet"}</h3>
                <p className="text-[#8B96A5]">Check back later as customers start placing orders.</p>
             </div>
           ) : (
             orders.map(order => (
               <div key={order._id} className="card overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-center">
                     <div className="flex gap-8">
                        <div>
                           <p className="text-[10px] font-bold text-[#8B96A5] uppercase mb-1">Order ID</p>
                           <p className="text-xs font-bold text-[#1C1C1C]">{order.orderId}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-[#8B96A5] uppercase mb-1">Time</p>
                           <p className="text-xs font-medium text-[#1C1C1C]">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-[#8B96A5] uppercase mb-1">Customer</p>
                           <p className="text-xs font-medium text-[#1C1C1C]">{order.user.name}</p>
                        </div>
                     </div>
                     <span className="text-sm font-black text-primary">${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="p-4 flex flex-wrap gap-4">
                     {order.items.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <div className="w-8 h-8 relative">
                             <NextImage src={item.image} alt={item.name} fill className="object-contain" unoptimized />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-[#1C1C1C] max-w-[120px] truncate">{item.name}</p>
                             <p className="text-[9px] text-[#8B96A5]">Qty: {item.quantity}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
