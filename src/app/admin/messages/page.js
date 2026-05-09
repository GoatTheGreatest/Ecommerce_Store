"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "../../../components/Loader";

export default function AdminMessages() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchInquiries();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchInquiries, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      setInquiries(data);
      if (data.length > 0 && !selectedChat) {
        setSelectedChat(data[0]);
        if (!data[0].isRead) markAsRead(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true })
      });
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, isRead: true } : i));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return <div className="container-custom py-20"><Loader /></div>;
  }

  return (
    <div className="bg-[#F7FAFC] min-h-screen">
      <div className="container-custom py-10">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h1 className="text-3xl font-black text-[#1C1C1C]">Supplier Messages</h1>
              <p className="text-[#8B96A5] text-sm">Global inquiries from potential customers</p>
           </div>
           <Link href="/admin" className="btn-outline">Back to Dashboard</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[600px]">
           {/* Sidebar - Chat List */}
           <div className="lg:col-span-4 border-r border-gray-100 flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                 <input type="text" placeholder="Search inquiries..." className="flex-1 p-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                 <button 
                  onClick={fetchInquiries}
                  className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-primary"
                  title="Refresh Messages"
                 >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                 </button>
              </div>
              <div className="p-4 bg-gray-100/50">
                 <h4 className="text-[10px] font-black text-[#8B96A5] uppercase tracking-widest px-2">Messages</h4>
              </div>
              <div className="flex-1 overflow-y-auto">
                 <div className="px-4 py-2 bg-blue-50/30 border-b border-blue-50">
                    <button className="flex items-center justify-between w-full text-xs font-bold text-primary group">
                       <span className="flex items-center gap-2">
                          <span className="text-sm">👥</span>
                          Customers
                       </span>
                       <span className="bg-primary text-white px-1.5 py-0.5 rounded text-[8px]">{inquiries.length}</span>
                    </button>
                 </div>
                 {loading ? (
                    <div className="p-10 text-center"><Loader /></div>
                 ) : inquiries.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 text-sm">No inquiries yet</div>
                 ) : (
                    inquiries.map((inquiry) => (
                       <div 
                        key={inquiry._id} 
                        onClick={() => {
                          setSelectedChat(inquiry);
                          if (!inquiry.isRead) markAsRead(inquiry._id);
                        }}
                        className={`p-5 border-b border-gray-50 cursor-pointer transition-all hover:bg-blue-50/50 flex gap-3 ${selectedChat?._id === inquiry._id ? 'bg-blue-50 border-r-4 border-r-primary' : ''}`}
                       >
                          {!inquiry.isRead && (
                             <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0 animate-pulse"></div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                               <h4 className="font-bold text-[#1C1C1C] text-sm truncate">{inquiry.itemName}</h4>
                               <span className="text-[10px] text-[#8B96A5] font-medium">{new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs text-primary font-bold mb-1">@{inquiry.customer.name}</p>
                            <p className="text-[11px] text-[#8B96A5] line-clamp-1 italic">"{inquiry.details}"</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

           {/* Main Chat Area */}
           <div className="lg:col-span-8 flex flex-col bg-gray-50/30">
              {selectedChat ? (
                 <>
                    {/* Chat Header */}
                    <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                             {selectedChat.customer.name[0].toUpperCase()}
                          </div>
                          <div>
                             <h3 className="font-black text-[#1C1C1C] leading-tight">{selectedChat.customer.name}</h3>
                             <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Customer Inquiry
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-[#8B96A5] uppercase tracking-widest">Requested Item</p>
                          <p className="text-sm font-bold text-primary">{selectedChat.itemName}</p>
                       </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-8 overflow-y-auto space-y-6">
                       <div className="flex justify-center">
                          <span className="bg-gray-200 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                             Inquiry received on {new Date(selectedChat.createdAt).toLocaleDateString()}
                          </span>
                       </div>

                       {/* The Inquiry Message (Group Chat Style) */}
                       <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
                             {selectedChat.customer.name[0]}
                          </div>
                          <div className="max-w-[80%]">
                             <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                                <p className="text-xs font-black text-primary mb-2">@{selectedChat.customer.name}</p>
                                <p className="text-sm text-[#505050] leading-relaxed mb-4">
                                   {selectedChat.details}
                                </p>
                                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                      <span className="text-xl">📦</span>
                                      <div>
                                         <p className="text-[10px] font-black text-gray-400 uppercase">Quantity Needed</p>
                                         <p className="text-sm font-black text-[#1C1C1C]">{selectedChat.quantity} {selectedChat.unit}</p>
                                      </div>
                                   </div>
                                   <button className="btn-outline text-[10px] py-1.5 px-4 bg-white">Verify Specs</button>
                                </div>
                             </div>
                             <p className="text-[10px] text-[#8B96A5] mt-2 ml-1">
                                Sent at {new Date(selectedChat.createdAt).toLocaleTimeString()}
                             </p>
                          </div>
                       </div>

                       {/* Admin Placeholder */}
                       <div className="flex flex-row-reverse items-start gap-4">
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-md">
                             {user.name[0]}
                          </div>
                          <div className="max-w-[80%]">
                             <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-lg">
                                <p className="text-xs font-black opacity-80 mb-1">You (Supplier)</p>
                                <p className="text-sm">Hi {selectedChat.customer.name.split(" ")[0]}, we received your request for {selectedChat.itemName}. We can provide this at a custom rate. Please check your email for the quote.</p>
                             </div>
                             <p className="text-[10px] text-[#8B96A5] mt-2 text-right mr-1">Draft reply</p>
                          </div>
                       </div>
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-6 bg-white border-t border-gray-100">
                       <div className="flex gap-4">
                          <input 
                            type="text" 
                            placeholder={`Reply to ${selectedChat.customer.name}...`} 
                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                          />
                          <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                             Send Quote
                          </button>
                       </div>
                    </div>
                 </>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mb-6">💬</div>
                    <h3 className="text-xl font-black text-[#1C1C1C] mb-2">No Inquiry Selected</h3>
                    <p className="text-[#8B96A5] max-w-xs">Select a message from the sidebar to view full request details and respond.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
