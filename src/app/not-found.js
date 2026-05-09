import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8 group">
        {/* Large 404 Background */}
        <h1 className="text-[150px] md:text-[220px] font-black text-gray-100 select-none leading-none animate-in fade-in zoom-in duration-700">
          404
        </h1>
        
        {/* Floating Shopping Bag Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-2xl animate-bounce hover:scale-110 transition-transform duration-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-md animate-in slide-in-from-bottom-10 duration-700">
        <h2 className="text-3xl font-bold text-[#1C1C1C] mb-4">Lost in the marketplace?</h2>
        <p className="text-[#8B96A5] mb-8 text-lg">
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist anymore.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </Link>
          <Link 
            href="/products" 
            className="bg-white text-primary px-8 py-3 rounded-xl font-bold border-2 border-primary/20 hover:border-primary transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Browse Products
          </Link>
        </div>
      </div>

      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse [animation-delay:1s]"></div>
    </div>
  );
}
