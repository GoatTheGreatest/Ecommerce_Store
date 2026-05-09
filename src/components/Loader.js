export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 w-full">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
        </div>
      </div>
      <p className="text-[#8B96A5] text-sm mt-4 animate-pulse font-medium">Loading items...</p>
    </div>
  );
}
