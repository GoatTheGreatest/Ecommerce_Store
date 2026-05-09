"use client";

import { useCart } from "../context/CartContext";

export default function Toast() {
  const { toast, hideToast } = useCart();

  if (!toast.show) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#0D6EFD] text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 min-w-[280px] border border-white/10">
        <div className="bg-white/20 rounded-full p-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span className="flex-1 font-semibold tracking-wide">{toast.message}</span>
        <button 
          onClick={hideToast}
          className="text-white/70 hover:text-white transition-colors p-1 bg-white/10 hover:bg-white/20 rounded-full"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      {/* Progress Bar - using a lighter white overlay to show countdown */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-b-lg animate-progress-shrink w-full"></div>
    </div>
  );
}
