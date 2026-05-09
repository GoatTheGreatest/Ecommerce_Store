"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const countryData = [
  { name: "Pakistan", code: "+92", length: 10, flag: "🇵🇰" },
  { name: "USA", code: "+1", length: 10, flag: "🇺🇸" },
  { name: "UK", code: "+44", length: 10, flag: "🇬🇧" },
  { name: "India", code: "+91", length: 10, flag: "🇮🇳" },
  { name: "UAE", code: "+971", length: 9, flag: "🇦🇪" },
  { name: "Germany", code: "+49", length: 11, flag: "🇩🇪" },
  { name: "Canada", code: "+1", length: 10, flag: "🇨🇦" },
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryIndex, setCountryIndex] = useState(0); // Default Pakistan
  const [agree, setAgree] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!name || !email || !password || !phone) {
      setError("Please fill in all fields");
      return;
    }

    // Validate phone length
    const country = countryData[countryIndex];
    if (phone.length !== country.length) {
      setError(`Phone number for ${country.name} must be ${country.length} digits long.`);
      return;
    }

    if (!agree) {
      setError("Please agree to the terms and conditions");
      return;
    }

    const fullPhone = `${country.code} ${phone}`;
    const success = register(name, email, password, isAdmin ? "admin" : "user", fullPhone);
    if (success) {
      router.push("/");
    } else {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <Link href="/" className="flex justify-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#1C1C1C]">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-[#8B96A5]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-blue-700 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium animate-shake">
              {error}
            </div>
          )}
          <div className="rounded-md space-y-4">
            <div>
              <label className="text-sm font-medium text-[#505050] mb-1 block">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-[#1C1C1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#505050] mb-1 block">Email address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-[#1C1C1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Phone Number Input */}
            <div>
              <label className="text-sm font-medium text-[#505050] mb-1 block">Phone Number</label>
              <div className="flex gap-2">
                 <select 
                  value={countryIndex}
                  onChange={(e) => setCountryIndex(e.target.value)}
                  className="w-24 px-2 py-3 border border-gray-300 bg-gray-50 text-[#1C1C1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                 >
                    {countryData.map((c, i) => (
                      <option key={i} value={i}>{c.flag} {c.code}</option>
                    ))}
                 </select>
                 <input
                  type="tel"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-[#1C1C1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder={`300 1234567 (${countryData[countryIndex].length} digits)`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#505050] mb-1 block">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-[#1C1C1C] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agree" className="text-[#505050] cursor-pointer">
                I agree to the <Link href="#" className="text-primary font-medium hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-medium hover:underline">Privacy Policy</Link>
              </label>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center h-5">
              <input
                id="is-admin"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="is-admin" className="text-[#1C1C1C] font-bold cursor-pointer">
                Register as Admin
              </label>
              <p className="text-[10px] text-[#8B96A5]">Grants access to product management</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md active:scale-95"
            >
              Create Account
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#8B96A5]">Or register with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button type="button" className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm text-[#505050]">
                <Image src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" width={20} height={20} className="mr-2" unoptimized />
                Google
             </button>
             <button type="button" className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm text-[#505050]">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" width={20} height={20} className="mr-2" unoptimized />
                Facebook
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
