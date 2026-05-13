"use client";

import { useState, useEffect, useRef } from "react";
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
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchInquiries();
    const interval = setInterval(fetchInquiries, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (inquiry) => {
    setSelectedChat(inquiry);
    setReplyText("");
    if (!inquiry.isRead) {
      await markAsRead(inquiry._id);
    }
    // Fetch latest version of this inquiry (with all replies)
    try {
      const res = await fetch(`/api/inquiries/${inquiry._id}`);
      const fresh = await res.json();
      setSelectedChat(fresh);
      setInquiries((prev) => prev.map((i) => (i._id === fresh._id ? fresh : i)));
    } catch (err) {
      console.error("Error fetching inquiry detail:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      setInquiries((prev) =>
        prev.map((i) => (i._id === id ? { ...i, isRead: true } : i))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;
    setSending(true);
    try {
      const res = await fetch(`/api/inquiries/${selectedChat._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "admin",
          text: replyText.trim(),
          senderName: user.name,
        }),
      });
      const updated = await res.json();
      setSelectedChat(updated);
      setInquiries((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );
      setReplyText("");
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSending(false);
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
            <h1 className="text-3xl font-black text-[#1C1C1C]">Customer Messages</h1>
            <p className="text-[#8B96A5] text-sm">Inquiries from customers — reply directly below</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchInquiries}
              className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-all text-primary"
              title="Refresh Messages"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
            <Link href="/admin" className="btn-outline">Back to Dashboard</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[600px]">

          {/* Sidebar - Chat List */}
          <div className="lg:col-span-4 border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">👥</span>
                <h4 className="text-xs font-black text-[#8B96A5] uppercase tracking-widest">Customers</h4>
                <span className="ml-auto bg-primary text-white px-1.5 py-0.5 rounded text-[8px] font-bold">
                  {inquiries.length}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-10 text-center"><Loader /></div>
              ) : inquiries.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm">No inquiries yet</div>
              ) : (
                inquiries.map((inquiry) => (
                  <div
                    key={inquiry._id}
                    onClick={() => handleSelectChat(inquiry)}
                    className={`p-5 border-b border-gray-50 cursor-pointer transition-all hover:bg-blue-50/50 flex gap-3 ${
                      selectedChat?._id === inquiry._id ? "bg-blue-50 border-r-4 border-r-primary" : ""
                    }`}
                  >
                    {!inquiry.isRead && (
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0 animate-pulse" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-[#1C1C1C] text-sm truncate">{inquiry.itemName}</h4>
                        <span className="text-[10px] text-[#8B96A5] font-medium">
                          {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-bold mb-1">@{inquiry.customer?.name}</p>
                      <p className="text-[11px] text-[#8B96A5] line-clamp-1 italic">&quot;{inquiry.details}&quot;</p>
                      {inquiry.replies?.length > 0 && (
                        <span className="text-[10px] text-green-600 font-bold mt-1 block">
                          {inquiry.replies.length} {inquiry.replies.length === 1 ? "reply" : "replies"}
                        </span>
                      )}
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
                      {selectedChat.customer?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-[#1C1C1C] leading-tight">{selectedChat.customer?.name}</h3>
                      <p className="text-xs text-[#8B96A5]">{selectedChat.customer?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#8B96A5] uppercase tracking-widest">Item Requested</p>
                    <p className="text-sm font-bold text-primary">{selectedChat.itemName}</p>
                    <p className="text-xs text-[#8B96A5]">{selectedChat.quantity} {selectedChat.unit}</p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  <div className="flex justify-center">
                    <span className="bg-gray-200 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                      Inquiry received on {new Date(selectedChat.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Original customer inquiry */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                      {selectedChat.customer?.name?.[0]}
                    </div>
                    <div className="max-w-[75%]">
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                        <p className="text-xs font-black text-primary mb-2">@{selectedChat.customer?.name}</p>
                        <p className="text-sm text-[#505050] leading-relaxed">{selectedChat.details}</p>
                      </div>
                      <p className="text-[10px] text-[#8B96A5] mt-1 ml-1">
                        {new Date(selectedChat.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* All replies */}
                  {selectedChat.replies?.map((reply, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 ${reply.sender === "admin" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          reply.sender === "admin"
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {reply.senderName?.[0]?.toUpperCase()}
                      </div>
                      <div className={`max-w-[75%] ${reply.sender === "admin" ? "items-end" : ""}`}>
                        <div
                          className={`p-4 rounded-2xl shadow-sm text-sm ${
                            reply.sender === "admin"
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-white text-[#1C1C1C] border border-gray-100 rounded-tl-none"
                          }`}
                        >
                          <p className={`text-xs font-black mb-1 ${reply.sender === "admin" ? "opacity-80" : "text-primary"}`}>
                            {reply.sender === "admin" ? `You (${reply.senderName})` : `@${reply.senderName}`}
                          </p>
                          <p>{reply.text}</p>
                        </div>
                        <p className={`text-[10px] text-[#8B96A5] mt-1 ${reply.sender === "admin" ? "text-right mr-1" : "ml-1"}`}>
                          {new Date(reply.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Reply Input */}
                <div className="p-6 bg-white border-t border-gray-100">
                  <form onSubmit={handleSendReply} className="flex gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${selectedChat.customer?.name}...`}
                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                    />
                    <button
                      type="submit"
                      disabled={sending || !replyText.trim()}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
                    >
                      {sending ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : null}
                      Send Reply
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mb-6">💬</div>
                <h3 className="text-xl font-black text-[#1C1C1C] mb-2">No Inquiry Selected</h3>
                <p className="text-[#8B96A5] max-w-xs">Select a message from the sidebar to view the full request and reply.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
