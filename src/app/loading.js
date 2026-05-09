export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-20 h-20 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
        
        {/* Brand Icon in Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center animate-pulse shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-6 flex flex-col items-center">
        <h2 className="text-xl font-bold text-[#1C1C1C] tracking-tight">Loading Brand</h2>
        <p className="text-[#8B96A5] text-sm mt-1 animate-pulse">Setting up your experience...</p>
      </div>
      
      {/* Small Decorative Dots */}
      <div className="flex gap-1.5 mt-4">
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
