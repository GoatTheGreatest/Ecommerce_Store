"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Messages() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  const [inquiries, setInquiries] = useState([]);
  const searchParams = useSearchParams();
  const initNew = searchParams.get("new");
  const initSeller = searchParams.get("sellerName");
  const initItem = searchParams.get("item");

  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(initSeller || null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newMsg, setNewMsg] = useState({
    itemName: initItem || "",
    details: "",
    quantity: 1,
    unit: "Pcs",
    targetSeller: initSeller || "Admin Support"
  });
  const [submitting, setSubmitting] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (initSeller) {
      setSelectedEmail(initSeller);
    }
  }, [initSeller]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchInquiries();
      const interval = setInterval(fetchInquiries, 30000);
      return () => clearInterval(interval);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();

      let filtered = data;
      if (isAdmin) {
        // Admins see messages directed to them OR messages they sent to others
        filtered = data.filter(i => 
          !i.targetSeller || 
          i.targetSeller === "Admin Support" || 
          i.targetSeller === user.name ||
          i.customer?.email === user.email
        );
      } else {
        // Users see only their own messages
        filtered = data.filter(i => i.customer?.email === user?.email);
      }
      setInquiries(filtered);

      // Auto-select conversation for user if it's their only one
      if (!isAdmin && filtered.length > 0 && !selectedEmail && !showNewForm) {
        setSelectedEmail("admin");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Grouping Logic ───────────────────────────────────────────────────────
  const getOtherParty = (inq) => {
    if (inq.customer?.email === user?.email) {
      return {
        email: inq.targetSeller || "Admin Support",
        name: inq.targetSeller || "Admin Support"
      };
    }
    return {
      email: inq.customer?.email || "unknown",
      name: inq.customer?.name || "Unknown Customer"
    };
  };

  const customerGroups = Object.values(
    inquiries.reduce((acc, inq) => {
      const party = getOtherParty(inq);
      if (!acc[party.email]) {
        acc[party.email] = { email: party.email, name: party.name, inquiries: [] };
      }
      acc[party.email].inquiries.push(inq);
      return acc;
    }, {})
  );

  if (initSeller) {
    const exists = customerGroups.find(g => g.email === initSeller);
    if (!exists) {
      customerGroups.unshift({ email: initSeller, name: initSeller, inquiries: [] });
    }
  }

  const selectedConversationInquiries = selectedEmail
    ? [...inquiries.filter(i => getOtherParty(i).email === selectedEmail)].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : [];

  const selectedGroup = customerGroups.find(g => g.email === selectedEmail);

  // For replying, we attach the reply to the most recent inquiry in the thread
  const latestInquiry = selectedConversationInquiries[selectedConversationInquiries.length - 1];

  const handleSelectCustomer = async (group) => {
    setSelectedEmail(group.email);
    setShowNewForm(false);
    setReplyText("");

    // Mark inquiries as read depending on role
    if (isAdmin) {
      const unread = group.inquiries.filter(i => !i.isRead);
      if (unread.length > 0) {
        await Promise.all(unread.map(i =>
          fetch(`/api/inquiries/${i._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true }),
          })
        ));
        setInquiries(prev => prev.map(i =>
          unread.some(u => u._id === i._id) ? { ...i, isRead: true } : i
        ));
      }
    } else {
      const unread = group.inquiries.filter(i => i.isUserRead === false);
      if (unread.length > 0) {
        await Promise.all(unread.map(i =>
          fetch(`/api/inquiries/${i._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isUserRead: true }),
          })
        ));
        setInquiries(prev => prev.map(i =>
          unread.some(u => u._id === i._id) ? { ...i, isUserRead: true } : i
        ));
      }
    }

    // Refresh the thread
    const updated = await Promise.all(
      group.inquiries.map(i => fetch(`/api/inquiries/${i._id}`).then(r => r.json()))
    );
    setInquiries(prev => prev.map(i => updated.find(u => u._id === i._id) || i));
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    try {
      if (!latestInquiry) {
        // Create new inquiry directly from chat box
        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemName: initItem || "General Inquiry",
            details: replyText.trim(),
            quantity: 1,
            unit: "Pcs",
            targetSeller: selectedEmail,
            customer: { name: user.name, email: user.email, userId: user.id },
          }),
        });
        const created = await res.json();
        setInquiries(prev => [created, ...prev]);
        setReplyText("");
      } else {
        const res = await fetch(`/api/inquiries/${latestInquiry._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: isAdmin && latestInquiry.customer?.email !== user.email ? "admin" : "user",
            text: replyText.trim(),
            senderName: isAdmin && latestInquiry.customer?.email !== user.email ? "Admin" : user.name,
          }),
        });
        const updated = await res.json();
        setInquiries(prev => prev.map(i => i._id === updated._id ? updated : i));
        setReplyText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleNewInquiry = async (e) => {
    e.preventDefault();
    if (!newMsg.itemName.trim() || !newMsg.details.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMsg,
          customer: { name: user.name, email: user.email, userId: user.id },
        }),
      });
      const created = await res.json();
      setInquiries(prev => [created, ...prev]);
      setNewMsg({ itemName: "", details: "", quantity: 1, unit: "Pcs", targetSeller: "Admin Support" });
      setShowNewForm(false);
      setSelectedEmail(newMsg.targetSeller);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-[#F7FAFC] min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#F7FAFC] min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">Sign in to view messages</h2>
          <p className="text-[#8B96A5] mb-6">You need to be logged in to send or receive messages.</p>
          <Link href="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7FAFC] min-h-[calc(100vh-140px)]">
      <div className="container-custom py-5 h-[calc(100vh-160px)]">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex h-full">

          {/* ── SIDEBAR ─────────────────────────────────────────── */}
          <aside className="w-full md:w-[300px] border-r border-gray-200 flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-[#1C1C1C]">{isAdmin ? "Messages" : "My Messages"}</h1>
                {isAdmin && <p className="text-[11px] text-[#8B96A5]">{customerGroups.length} customer{customerGroups.length !== 1 ? "s" : ""}</p>}
              </div>
              {!isAdmin && (
                <button onClick={() => { setShowNewForm(true); setSelectedEmail(null); }}
                  className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all">
                  + New
                </button>
              )}
              {isAdmin && (
                <button onClick={fetchInquiries} className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-primary" title="Refresh">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-10 flex justify-center"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
              ) : customerGroups.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  <div className="text-4xl mb-3">📭</div>
                  <p>{isAdmin ? "No customer inquiries yet" : "No messages yet"}</p>
                  {!isAdmin && <p className="text-xs mt-1">Click "+ New" to contact an admin</p>}
                </div>
              ) : (
                customerGroups.map(group => {
                  const unreadCount = isAdmin
                    ? group.inquiries.filter(i => !i.isRead).length
                    : group.inquiries.filter(i => i.isUserRead === false).length;
                  const hasAdminReply = !isAdmin && group.inquiries.some(i => i.replies?.some(r => r.sender === "admin"));
                  const lastInq = [...group.inquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

                  return (
                    <div key={group.email} onClick={() => handleSelectCustomer(group)}
                      className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4 ${selectedEmail === group.email && !showNewForm ? "bg-blue-50 border-primary" : "border-transparent hover:bg-gray-50"}`}>
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
                        {isAdmin ? group.name?.[0]?.toUpperCase() : "A"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className={`text-sm truncate ${unreadCount > 0 ? "font-black text-[#1C1C1C]" : "font-bold text-[#1C1C1C]"}`}>{group.name}</h3>
                          {lastInq && <span className="text-[10px] text-[#8B96A5] ml-1 shrink-0">{new Date(lastInq.createdAt).toLocaleDateString()}</span>}
                        </div>
                        <p className="text-xs text-[#8B96A5] truncate">{isAdmin ? lastInq?.details : "Click to view conversation"}</p>
                        {hasAdminReply && <span className="text-[10px] font-bold text-green-600 mt-0.5 inline-block">● Admin replied</span>}
                        {isAdmin && lastInq && <p className="text-[10px] text-primary mt-0.5">{group.inquiries.length} inquiry/messages</p>}
                      </div>
                      {unreadCount > 0 && (
                        <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">{unreadCount}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* ── CHAT AREA ─────────────────────────────────────────── */}
          <main className="flex-1 flex flex-col bg-[#F7FAFC]/30">

            {showNewForm && !isAdmin ? (
              // ── NEW INQUIRY FORM (USER ONLY) ──
              <div className="flex-1 flex flex-col">
                <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3">
                  <button onClick={() => setShowNewForm(false)} className="text-gray-400 hover:text-primary">← Back</button>
                  <h2 className="font-bold text-[#1C1C1C]">New Message to {newMsg.targetSeller}</h2>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                  <form onSubmit={handleNewInquiry} className="max-w-xl mx-auto space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#1C1C1C] mb-1">Subject / Item</label>
                      <input type="text" required value={newMsg.itemName} onChange={e => setNewMsg({ ...newMsg, itemName: e.target.value })}
                        placeholder="e.g. Wholesale Pricing, Product Inquiry..."
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1C1C1C] mb-1">Message</label>
                      <textarea required rows={5} value={newMsg.details} onChange={e => setNewMsg({ ...newMsg, details: e.target.value })}
                        placeholder="Describe your inquiry in detail..."
                        className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary transition-all resize-none" />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-[#1C1C1C] mb-1">Quantity</label>
                        <input type="number" min={1} value={newMsg.quantity} onChange={e => setNewMsg({ ...newMsg, quantity: parseInt(e.target.value) })}
                          className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary transition-all" />
                      </div>
                      <div className="w-28">
                        <label className="block text-sm font-bold text-[#1C1C1C] mb-1">Unit</label>
                        <select value={newMsg.unit} onChange={e => setNewMsg({ ...newMsg, unit: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary bg-white">
                          <option>Pcs</option><option>Kg</option><option>Boxes</option><option>Sets</option><option>Units</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Send Message
                    </button>
                  </form>
                </div>
              </div>

            ) : selectedEmail && selectedGroup ? (
              // ── UNIFIED CHAT THREAD ──
              <>
                <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {isAdmin ? selectedGroup.name?.[0]?.toUpperCase() : "A"}
                  </div>
                  <div>
                    <h2 className="font-bold text-[#1C1C1C]">{selectedGroup.name}</h2>
                    <p className="text-[11px] text-[#8B96A5]">
                      {isAdmin ? selectedGroup.email : "Official Support"} · {selectedConversationInquiries.length} inquiry thread{selectedConversationInquiries.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {selectedConversationInquiries.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
                      <div className="text-4xl">👋</div>
                      <p className="text-[#1C1C1C] font-bold">Say hello to {selectedGroup.name}</p>
                      <p className="text-sm text-[#8B96A5]">You haven't messaged this seller yet.<br />Type below to start the conversation!</p>
                    </div>
                  )}
                  {selectedConversationInquiries.map((inq, idx) => {
                    const messages = [
                      { _id: `init-${inq._id}`, sender: "user", text: inq.details, name: inq.customer?.name, time: inq.createdAt, isInitial: true },
                      ...(inq.replies || []).map((r, ri) => ({ _id: r._id || `reply-${ri}`, sender: r.sender, text: r.text, name: r.senderName, time: r.createdAt }))
                    ];

                    return (
                      <div key={inq._id} className="space-y-2">
                        {/* Subject label for the thread */}
                        <div className="flex justify-center my-4">
                          <span className="bg-blue-50 text-primary border border-blue-100 text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm">
                            Subject: {inq.itemName} · Qty: {inq.quantity} {inq.unit}
                          </span>
                        </div>

                        {messages.map((msg, mi) => {
                          // "isMine" is determined by whether we sent the message
                          const isMine = (msg.sender === "user" && inq.customer?.email === user?.email) || 
                                         (msg.sender === "admin" && inq.customer?.email !== user?.email);

                          // Determine if we show the avatar/name
                          const showSenderInfo = mi === 0 || messages[mi - 1]?.sender !== msg.sender;

                          return (
                            <div key={msg._id} className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
                              {showSenderInfo ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMine ? "bg-primary text-white" : "bg-gray-200 text-[#505050]"}`}>
                                  {msg.sender === "admin" ? "A" : msg.name?.[0]?.toUpperCase()}
                                </div>
                              ) : <div className="w-8 shrink-0" />}

                              <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm ${isMine
                                  ? "bg-primary text-white rounded-br-sm"
                                  : "bg-white border border-gray-100 text-[#1C1C1C] rounded-bl-sm"
                                }`}>
                                {showSenderInfo && (
                                  <p className={`text-[10px] font-bold mb-1 ${isMine ? "opacity-70 text-white" : "text-primary"}`}>
                                    {isMine ? "You" : (msg.sender === "admin" ? `Admin Support` : msg.name)}
                                  </p>
                                )}
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <span className={`text-[9px] mt-1.5 block text-right font-medium ${isMine ? "text-white/60" : "text-[#8B96A5]"}`}>
                                  {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                  <form onSubmit={handleSendReply} className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 pr-1.5 border border-gray-200 shadow-inner">
                    <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)}
                      placeholder={`Reply to ${isAdmin ? selectedGroup.name : "Admin Support"}...`}
                      className="flex-1 bg-transparent border-none outline-none text-sm text-[#1C1C1C] py-2.5 px-3" />
                    <button type="submit" disabled={sending || !replyText.trim()}
                      className="bg-primary text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center">
                      {sending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rotate-90 translate-x-0.5"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>}
                    </button>
                  </form>
                </div>
              </>

            ) : (
              // ── EMPTY STATE ──
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">No conversation selected</h3>
                <p className="text-[#8B96A5] mb-6 max-w-xs">
                  {isAdmin ? "Select a customer from the sidebar to view their messages." : "Select the Admin Support conversation from the sidebar."}
                </p>
                {!isAdmin && inquiries.length === 0 && (
                  <button onClick={() => setShowNewForm(true)}
                    className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition-all">
                    + Create First Message
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
