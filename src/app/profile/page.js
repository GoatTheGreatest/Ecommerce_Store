"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import Link from "next/link";
import Loader from "../../components/Loader";

const ANIME_AVATARS = [
  { name: "Pikachu", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
  { name: "Charizard", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" },
  { name: "Gengar", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" },
  { name: "Lucario", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png" },
  { name: "Greninja", url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png" }
];

export default function Profile() {
  const { user, loading, updateUser, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Personal Info");
  
  // Personal Info State
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState("");
  const [customAvatar, setCustomAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Security State
  const [securityModal, setSecurityModal] = useState(null); // 'password', '2fa', 'delete'
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

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
    return <div className="container-custom py-20"><Loader /></div>;
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
        setCustomAvatar(reader.result);
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await updateUser({ name, dob, gender, avatar });
    if (result) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleSecurityAction = (action) => {
    if (action === 'password') {
      if (!passwords.old || !passwords.new || passwords.new !== passwords.confirm) {
        setMessage({ type: "error", text: "Passwords do not match or are empty" });
        return;
      }
      setMessage({ type: "success", text: "Password changed successfully!" });
    } else if (action === '2fa') {
      setMessage({ type: "success", text: "Two-Factor Authentication enabled!" });
    } else if (action === 'delete') {
      logout();
      router.push("/");
      return;
    }
    setSecurityModal(null);
    setPasswords({ old: "", new: "", confirm: "" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Personal Info":
        return (
          <div className="card p-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-[#1C1C1C]">Personal Information</h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary font-bold hover:underline flex items-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {message.text && (
              <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Avatar Section */}
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
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary text-white flex items-center justify-center text-4xl font-bold">
                         {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="space-y-4 w-full">
                      <div className="text-center">
                        <label className="text-primary font-bold text-sm cursor-pointer hover:underline">
                          Upload Custom Photo
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </label>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-bold text-[#8B96A5] mb-3 text-center uppercase tracking-wider">Or choose a character</p>
                        <div className="grid grid-cols-5 gap-2">
                           {ANIME_AVATARS.map((av, i) => (
                             <div 
                               key={i}
                               onClick={() => {
                                 setAvatar(av.url);
                                 setCustomAvatar("");
                               }}
                               className={`aspect-square rounded-xl border-2 cursor-pointer transition-all p-1 hover:scale-110 active:scale-95 flex items-center justify-center ${avatar === av.url ? 'border-primary bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-primary/50'}`}
                             >
                               <NextImage src={av.url} alt={av.name} width={100} height={100} className="object-contain" loading={av.name === "Pikachu" ? "eager" : "lazy"} />
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      disabled={!isEditing}
                      className="w-full border-b-2 border-gray-100 focus:border-primary outline-none py-2 text-lg font-medium transition-colors bg-transparent disabled:opacity-70"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Date of Birth</label>
                      <input 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)} 
                        disabled={!isEditing}
                        className="w-full border-b-2 border-gray-100 focus:border-primary outline-none py-2 text-lg font-medium transition-colors bg-transparent disabled:opacity-70"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Gender</label>
                      <select 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)} 
                        disabled={!isEditing}
                        className="w-full border-b-2 border-gray-100 focus:border-primary outline-none py-2 text-lg font-medium transition-colors bg-transparent disabled:opacity-70"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1C1C1C] mb-2 uppercase tracking-wide">Email Address</label>
                    <p className="py-2 text-lg font-medium text-gray-400">{user.email}</p>
                    <p className="text-[10px] text-gray-400">Email cannot be changed for security.</p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-6">
                  <button type="submit" className="bg-primary text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        );
      case "Payment Methods":
        return (
          <div className="card p-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-[#1C1C1C]">Payment Methods</h2>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">+ Add Card</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-primary bg-blue-50/50 p-6 rounded-xl relative overflow-hidden group cursor-pointer">
                   <div className="flex justify-between items-start mb-10">
                      <div className="w-12 h-8 bg-white rounded border border-gray-200"></div>
                      <span className="text-primary font-bold text-xs">Primary</span>
                   </div>
                   <p className="text-lg font-bold text-[#1C1C1C] mb-1">•••• •••• •••• 4242</p>
                   <div className="flex justify-between text-xs text-gray-500">
                      <span>Expires 12/25</span>
                      <span>VISA</span>
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-red-500 font-bold">Remove</button>
                   </div>
                </div>
                <div className="border-2 border-dashed border-gray-200 p-6 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all cursor-pointer">
                   <span className="text-4xl mb-2">+</span>
                   <span className="text-sm font-bold">Add new payment method</span>
                </div>
             </div>
          </div>
        );
      case "Shipping Addresses":
        return (
          <div className="card p-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-[#1C1C1C]">Shipping Addresses</h2>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">+ New Address</button>
             </div>
             <div className="space-y-4">
                <div className="border border-gray-200 p-5 rounded-xl hover:shadow-md transition-all relative group">
                   <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-[#1C1C1C]">Home</span>
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Default</span>
                   </div>
                   <p className="text-sm text-[#505050] leading-relaxed">
                      123 Business Street, Suite 456<br/>
                      New York, NY 10001, USA<br/>
                      Phone: +1 (555) 000-1234
                   </p>
                   <div className="absolute top-5 right-5 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-primary font-bold text-sm">Edit</button>
                      <button className="text-red-500 font-bold text-sm">Delete</button>
                   </div>
                </div>
             </div>
          </div>
        );
      case "Security":
        return (
          <div className="card p-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-[#1C1C1C]">Security Settings</h2>
             </div>

             {message.text && (
              <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 animate-in fade-in zoom-in duration-300 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

             <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                   <div>
                      <h4 className="font-bold text-[#1C1C1C]">Change Password</h4>
                      <p className="text-xs text-[#8B96A5]">Update your password to stay secure.</p>
                   </div>
                   <button 
                    onClick={() => setSecurityModal('password')}
                    className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all"
                   >
                    Update
                   </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                   <div>
                      <h4 className="font-bold text-[#1C1C1C]">Two-Factor Authentication</h4>
                      <p className="text-xs text-[#8B96A5]">Add an extra layer of security to your account.</p>
                   </div>
                   <button 
                    onClick={() => setSecurityModal('2fa')}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700"
                   >
                    Enable
                   </button>
                </div>
                <div className="pt-6 border-t border-gray-100">
                   <h4 className="font-bold text-red-500 mb-2">Danger Zone</h4>
                   <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                   <button 
                    onClick={() => setSecurityModal('delete')}
                    className="bg-red-50 text-red-500 px-6 py-3 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                   >
                    Delete Account
                   </button>
                </div>
             </div>

             {/* Security Modals */}
             {securityModal && (
               <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                    {securityModal === 'password' && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-[#1C1C1C]">Change Password</h3>
                        <div className="space-y-4">
                           <input 
                            type="password" 
                            placeholder="Current Password" 
                            value={passwords.old}
                            onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                            className="w-full p-3 bg-gray-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-primary/20" 
                           />
                           <input 
                            type="password" 
                            placeholder="New Password" 
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            className="w-full p-3 bg-gray-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-primary/20" 
                           />
                           <input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full p-3 bg-gray-50 rounded-lg border-none outline-none focus:ring-2 focus:ring-primary/20" 
                           />
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button onClick={() => setSecurityModal(null)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                          <button onClick={() => handleSecurityAction('password')} className="flex-1 py-3 font-bold bg-primary text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all">Update</button>
                        </div>
                      </div>
                    )}

                    {securityModal === '2fa' && (
                      <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center text-4xl mx-auto">🛡️</div>
                        <h3 className="text-2xl font-bold text-[#1C1C1C]">Enable 2FA</h3>
                        <p className="text-gray-500 text-sm">We will send a code to <strong>{user.email}</strong> to verify your identity whenever you log in.</p>
                        <div className="flex gap-4 pt-4">
                          <button onClick={() => setSecurityModal(null)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                          <button onClick={() => handleSecurityAction('2fa')} className="flex-1 py-3 font-bold bg-primary text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all">Enable Now</button>
                        </div>
                      </div>
                    )}

                    {securityModal === 'delete' && (
                      <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto">⚠️</div>
                        <h3 className="text-2xl font-bold text-[#1C1C1C]">Delete Account?</h3>
                        <p className="text-gray-500 text-sm">This action is permanent and cannot be undone. All your orders, messages, and settings will be lost.</p>
                        <div className="flex gap-4 pt-4">
                          <button onClick={() => setSecurityModal(null)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Go Back</button>
                          <button onClick={() => handleSecurityAction('delete')} className="flex-1 py-3 font-bold bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-700 transition-all">Confirm Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
               </div>
             )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F7FAFC] min-h-screen pb-20">
      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="card p-5">
              <h3 className="text-lg font-bold text-[#1C1C1C] mb-6 px-2">Quick Navigation</h3>
              <nav className="space-y-1">
                {[
                  { name: "Personal Info", icon: "👤" },
                  { name: "My Orders", icon: "📦", link: "/orders" },
                  { name: "Payment Methods", icon: "💳" },
                  { name: "Shipping Addresses", icon: "📍" },
                  { name: "Security", icon: "🔒" }
                ].map((tab) => (
                  <button 
                    key={tab.name}
                    onClick={() => {
                      if (tab.link) router.push(tab.link);
                      else setActiveTab(tab.name);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 font-medium text-sm group ${activeTab === tab.name ? 'bg-primary text-white shadow-lg shadow-blue-200' : 'text-[#505050] hover:bg-blue-50 hover:text-primary'}`}
                  >
                    <span className={`text-lg transition-transform group-hover:scale-125 ${activeTab === tab.name ? 'opacity-100' : 'opacity-70'}`}>{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
            
            <button 
              onClick={() => router.push("/messages")}
              className="w-full bg-white border-2 border-gray-100 p-4 rounded-xl flex items-center gap-4 hover:border-primary transition-all group"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white transition-all">💬</div>
              <div className="text-left">
                 <p className="font-bold text-[#1C1C1C] text-sm">Need help?</p>
                 <p className="text-[10px] text-[#8B96A5]">Contact Support</p>
              </div>
            </button>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            {renderContent()}
            
            {/* Common Section for all tabs: Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
               <div className="card p-6 border-l-4 border-primary">
                  <p className="text-[#8B96A5] text-xs font-bold uppercase tracking-widest mb-1">Total Orders</p>
                  <p className="text-3xl font-black text-[#1C1C1C]">24</p>
               </div>
               <div className="card p-6 border-l-4 border-green-500">
                  <p className="text-[#8B96A5] text-xs font-bold uppercase tracking-widest mb-1">Delivered</p>
                  <p className="text-3xl font-black text-[#1C1C1C]">21</p>
               </div>
               <div className="card p-6 border-l-4 border-orange-500">
                  <p className="text-[#8B96A5] text-xs font-bold uppercase tracking-widest mb-1">Pending</p>
                  <p className="text-3xl font-black text-[#1C1C1C]">3</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
