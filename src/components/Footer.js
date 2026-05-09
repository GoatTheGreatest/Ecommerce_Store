"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on login and register pages
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6 mt-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              </div>
              <span className="text-2xl font-bold text-[#8B96A5]">Brand</span>
            </Link>
            <p className="text-[#505050] mb-4 max-w-xs">
              Best information about the company at following sites:
            </p>
            <div className="flex gap-3">
              {[
                { icon: "facebook", color: "#4267B2" },
                { icon: "twitter", color: "#1DA1F2" },
                { icon: "linkedin", color: "#0077b5" },
                { icon: "instagram", color: "#E1306C" },
                { icon: "youtube", color: "#FF0000" }
              ].map((social, i) => (
                <div key={i} className="w-8 h-8 bg-[#BDC4CD] rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-all text-white group shadow-sm">
                   {social.icon === "facebook" && <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>}
                   {social.icon === "twitter" && <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>}
                   {social.icon === "linkedin" && <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>}
                   {social.icon === "instagram" && <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>}
                   {social.icon === "youtube" && <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>}
                </div>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-bold text-[#1C1C1C] mb-4">About</h4>
            <ul className="text-[#8B96A5] space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/find-store" className="hover:text-primary">Find store</Link></li>
              <li><Link href="/categories" className="hover:text-primary">Categories</Link></li>
              <li><Link href="/blogs" className="hover:text-primary">Blogs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#1C1C1C] mb-4">Partnership</h4>
            <ul className="text-[#8B96A5] space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/find-store" className="hover:text-primary">Find store</Link></li>
              <li><Link href="/categories" className="hover:text-primary">Categories</Link></li>
              <li><Link href="/blogs" className="hover:text-primary">Blogs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#1C1C1C] mb-4">Information</h4>
            <ul className="text-[#8B96A5] space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/refund" className="hover:text-primary">Money Refund</Link></li>
              <li><Link href="/shipping" className="hover:text-primary">Shipping</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#1C1C1C] mb-4">For users</h4>
            <ul className="text-[#8B96A5] space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-primary">Login</Link></li>
              <li><Link href="/register" className="hover:text-primary">Register</Link></li>
              <li><Link href="/settings" className="hover:text-primary">Settings</Link></li>
              <li><Link href="/orders" className="hover:text-primary">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#1C1C1C] mb-4">Get app</h4>
            <div className="space-y-3">
               <div className="w-32 h-10 bg-[#1C1C1C] rounded flex items-center justify-center p-2 cursor-pointer">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" width={100} height={30} />
               </div>
               <div className="w-32 h-10 bg-[#1C1C1C] rounded flex items-center justify-center p-2 cursor-pointer">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" width={100} height={30} />
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#505050]">© 2024 Ecommerce. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[#505050]">
            <span>English</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
