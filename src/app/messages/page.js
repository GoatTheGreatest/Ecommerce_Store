"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import NextImage from "next/image";
import Link from "next/link";

const CONTACTS = [
  {
    id: 1,
    name: "Customer Support",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Support",
    status: "online",
    lastMsg: "How can I help you today?",
    time: "10:30 AM",
    unread: 2,
    role: "Official"
  },
  {
    id: 2,
    name: "Global Trading Co.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Global",
    status: "offline",
    lastMsg: "The shipment is on its way.",
    time: "Yesterday",
    unread: 0,
    role: "Supplier"
  },
  {
    id: 3,
    name: "Artel Market",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Artel",
    status: "online",
    lastMsg: "We have received your inquiry.",
    time: "Oct 12",
    unread: 0,
    role: "Supplier"
  }
];

export default function Messages() {
  const { user } = useAuth();
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [msgInput, setMsgInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatHistory, setChatHistory] = useState({
    1: [
      { sender: "them", text: "Hello! Welcome to our support center.", time: "10:25 AM" },
      { sender: "them", text: "How can I help you today?", time: "10:26 AM" }
    ],
    2: [
      { sender: "me", text: "Hi, what is the status of order #12345?", time: "Yesterday" },
      { sender: "them", text: "The shipment is on its way. You should receive it by Friday.", time: "Yesterday" }
    ],
    3: [
      { sender: "them", text: "We have received your inquiry regarding the wholesale prices.", time: "Oct 12" }
    ]
  });

  const chatEndRef = useRef(null);

  // Auto-scroll removed as per user request

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const newMsg = {
      sender: "me",
      text: msgInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg]
    }));
    setMsgInput("");
    setShowEmojiPicker(false);

    // Simulate reply
    setTimeout(() => {
      const reply = {
        sender: "them",
        text: "Thanks for your message! Our team will get back to you shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), reply]
      }));
    }, 1500);
  };

  return (
    <div className="bg-[#F7FAFC] min-h-[calc(100vh-140px)]">
      <div className="container-custom py-5 h-[calc(100vh-160px)]">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex h-full">
          
          {/* Sidebar */}
          <aside className="w-full md:w-[350px] border-r border-gray-200 flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-white sticky top-0">
              <h1 className="text-xl font-bold text-[#1C1C1C] mb-4">Messages</h1>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search contacts..." 
                  className="w-full bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <svg className="absolute left-3 top-2.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {CONTACTS.map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4 ${activeContact.id === contact.id ? 'bg-blue-50 border-primary' : 'border-transparent hover:bg-gray-50'}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                      <NextImage src={contact.avatar} alt={contact.name} width={48} height={48} className="object-cover" unoptimized={contact.avatar.includes('api.dicebear.com')} />
                    </div>
                    {contact.status === "online" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00B517] border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="font-bold text-[#1C1C1C] text-sm truncate">{contact.name}</h3>
                      <span className="text-[10px] text-[#8B96A5]">{contact.time}</span>
                    </div>
                    <p className={`text-xs truncate ${contact.unread > 0 ? 'text-[#1C1C1C] font-bold' : 'text-[#8B96A5]'}`}>
                      {contact.lastMsg}
                    </p>
                  </div>
                  {contact.unread > 0 && (
                    <div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {contact.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Chat Window */}
          <main className="flex-1 flex flex-col bg-[#F7FAFC]/30">
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                  <NextImage src={activeContact.avatar} alt={activeContact.name} width={40} height={40} className="object-cover" unoptimized={activeContact.avatar.includes('api.dicebear.com')} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-[#1C1C1C] leading-none">{activeContact.name}</h2>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">{activeContact.role}</span>
                  </div>
                  <span className="text-[11px] text-[#00B517]">{activeContact.status === "online" ? "Active now" : "Offline"}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-primary transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
                <button className="hover:text-primary transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></button>
                <button className="hover:text-primary transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory[activeContact.id]?.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "me" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-[#1C1C1C] border border-gray-100 rounded-tl-none"
                  }`}>
                    <p>{msg.text}</p>
                    <span className={`text-[10px] mt-1 block text-right ${msg.sender === "me" ? "text-white/70" : "text-[#8B96A5]"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {/* chatEndRef removed */}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-gray-100 rounded-xl p-2 pr-1 shadow-inner">
                <button type="button" className="p-2 text-gray-400 hover:text-primary transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <input 
                  type="text" 
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  onFocus={() => setShowEmojiPicker(false)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-[#1C1C1C] py-2"
                />
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-2 transition-colors rounded-full ${showEmojiPicker ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-primary hover:bg-primary/5'}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                  </button>

                  {/* Emoji Picker Popover */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-4 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 w-64 z-[100] animate-in zoom-in-95 slide-in-from-bottom-5 duration-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-[#1C1C1C]">Select Emoji</span>
                        <button onClick={() => setShowEmojiPicker(false)} className="text-gray-400 hover:text-red-500">×</button>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "👍", "👎", "🔥", "❤️", "✨", "✅"].map(emoji => (
                          <button 
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setMsgInput(prev => prev + emoji);
                              // setShowEmojiPicker(false); // Keep open for multiple emojis
                            }}
                            className="text-xl hover:scale-125 transition-transform p-1 rounded hover:bg-gray-50"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="bg-primary text-white p-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-all active:scale-90 flex items-center justify-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rotate-90"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </form>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
