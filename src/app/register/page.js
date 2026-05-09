"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!agree) {
      setError("Please agree to the terms and conditions");
      return;
    }

    const success = register(name, email, password);
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
                <Image src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" width={20} height={20} className="mr-2" />
                Google
             </button>
             <button type="button" className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm text-[#505050]">
                <Image src="https://www.svgrepo.com/show/353733/facebook.svg" alt="Facebook" width={20} height={20} className="mr-2" />
                Facebook
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
