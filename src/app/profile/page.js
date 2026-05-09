"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import Link from "next/link";

const ANIME_AVATARS = [
  { name: "Pikachu", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
  { name: "Charizard", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" },
  { name: "Mewtwo", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" },
  { name: "Gengar", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" },
  { name: "Lucario", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png" },
  { name: "Greninja", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png" },
];

export default function Profile() {
  const { user, updateUser, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState("");
  const [customAvatar, setCustomAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setName(user.name || "");
      setDob(user.dob || "");
      setGender(user.gender || "");
      setAvatar(user.avatar || "");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="container-custom py-20 text-center">Loading profile...</div>;
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size should be less than 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setCustomAvatar("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser({
      name,
      dob,
      gender,
      avatar: customAvatar || avatar
    });
    setIsEditing(false);
    setMessage({ type: "success", text: "Profile updated successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div className="bg-[#F7FAFC] min-h-screen pb-20">
      <div className="container-custom py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Info */}
          <div className="lg:w-1/3 space-y-6">
            <div className="card p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-primary/10"></div>
              <div className="relative pt-4 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white mb-4 flex items-center justify-center">
                  {avatar?.startsWith('data:image') || avatar?.startsWith('http') ? (
                    <NextImage 
                      src={avatar} 
                      alt="Profile" 
                      width={128} 
                      height={128} 
                      className="object-contain p-2"
                      unoptimized={avatar?.startsWith('data:image')}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary text-white flex items-center justify-center text-4xl font-bold">
                       {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#1C1C1C]">{user.name}</h2>
                <p className="text-[#8B96A5] mb-4">{user.email}</p>
                {user.role === "admin" && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Administrator</span>
                )}
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1C1C1C]">{user.orders?.length || 0}</p>
                  <p className="text-xs text-[#8B96A5] uppercase">Orders</p>
                </div>
                <div className="text-center border-l border-gray-100">
                  <p className="text-2xl font-bold text-[#1C1C1C]">0</p>
                  <p className="text-xs text-[#8B96A5] uppercase">Wishlist</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-[#1C1C1C] mb-4">Quick Navigation</h3>
              <div className="space-y-1">
                {['Personal Info', 'My Orders', 'Payment Methods', 'Shipping Addresses', 'Security'].map(item => (
                  <button key={item} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${item === 'Personal Info' ? 'bg-primary text-white font-medium' : 'text-[#505050] hover:bg-gray-50'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-2/3 space-y-6">
            {message.text && (
              <div className={`p-4 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}

            <div className="card p-8">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-[#1C1C1C]">Personal Information</h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary font-medium hover:underline text-sm"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#8B96A5] mb-2">Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                      />
                    ) : (
                      <p className="text-[#1C1C1C] font-medium p-3 bg-gray-50 rounded-lg">{name || "Not set"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B96A5] mb-2">Email Address</label>
                    <p className="text-[#8B96A5] font-medium p-3 bg-gray-100 rounded-lg cursor-not-allowed">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B96A5] mb-2">Date of Birth</label>
                    {isEditing ? (
                      <input 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                      />
                    ) : (
                      <p className="text-[#1C1C1C] font-medium p-3 bg-gray-50 rounded-lg">{dob || "Not set"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B96A5] mb-2">Gender</label>
                    {isEditing ? (
                      <select 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white focus:border-primary"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="text-[#1C1C1C] font-medium p-3 bg-gray-50 rounded-lg">{gender || "Not set"}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-[#8B96A5]">Change Avatar</label>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-[#505050] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 border border-gray-200"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        Upload from device
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-6">
                       {ANIME_AVATARS.map((av, i) => (
                         <div 
                           key={i}
                           onClick={() => {
                             setAvatar(av.url);
                             setCustomAvatar("");
                           }}
                           className={`aspect-square rounded-xl border-2 cursor-pointer transition-all p-1 hover:scale-110 active:scale-95 flex items-center justify-center ${avatar === av.url ? 'border-primary bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-primary/50'}`}
                         >
                           <NextImage src={av.url} alt={av.name} width={100} height={100} className="object-contain" />
                         </div>
                       ))}
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-xs font-medium text-[#8B96A5] mb-2">Or enter custom avatar URL</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/avatar.jpg"
                        value={customAvatar}
                        onChange={(e) => setCustomAvatar(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm"
                      />
                    </div>
                    
                    <button 
                      onClick={handleSave}
                      className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order History */}
            <div className="card p-8">
              <h3 className="text-xl font-bold text-[#1C1C1C] mb-6">Order History</h3>
              {user.orders?.length > 0 ? (
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-primary">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                         </div>
                         <div>
                            <p className="font-bold text-[#1C1C1C]">{order.id}</p>
                            <p className="text-xs text-[#8B96A5]">{order.date} • {order.items} items</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <p className="font-bold text-[#1C1C1C]">${order.total.toFixed(2)}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                               {order.status}
                            </span>
                         </div>
                         <button className="btn-outline py-2 text-sm px-4">Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                   <p className="text-[#8B96A5]">You haven&apos;t placed any orders yet.</p>
                   <Link href="/products" className="text-primary font-medium hover:underline mt-2 inline-block">Start shopping</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
