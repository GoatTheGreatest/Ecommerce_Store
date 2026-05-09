import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10 pb-6 mt-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <span className="text-2xl font-bold text-[#8B96A5]">Brand</span>
            </Link>
            <p className="text-[#505050] mb-4 max-w-xs">
              Best information about the company gies here but now lorem ipsum is
            </p>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 bg-[#BDC4CD] rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-colors text-white">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                </div>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-[#1C1C1C] mb-4">About</h4>
            <ul className="text-[#8B96A5] space-y-1">
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Find store</Link></li>
              <li><Link href="#">Categories</Link></li>
              <li><Link href="#">Blogs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1C1C1C] mb-4">Partnership</h4>
            <ul className="text-[#8B96A5] space-y-1">
              <li><Link href="#">About Us</Link></li>
              <li><Link href="#">Find store</Link></li>
              <li><Link href="#">Categories</Link></li>
              <li><Link href="#">Blogs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1C1C1C] mb-4">Information</h4>
            <ul className="text-[#8B96A5] space-y-1">
              <li><Link href="#">Help Center</Link></li>
              <li><Link href="#">Money Refund</Link></li>
              <li><Link href="#">Shipping</Link></li>
              <li><Link href="#">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#1C1C1C] mb-4">For users</h4>
            <ul className="text-[#8B96A5] space-y-1">
              <li><Link href="#">Login</Link></li>
              <li><Link href="#">Register</Link></li>
              <li><Link href="#">Settings</Link></li>
              <li><Link href="#">My Orders</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-semibold text-[#1C1C1C] mb-4">Get app</h4>
            <div className="space-y-2">
              <div className="bg-black text-white p-2 rounded-lg flex items-center gap-2 cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div className="text-[10px]">Download on <div className="text-sm font-bold">App Store</div></div>
              </div>
              <div className="bg-black text-white p-2 rounded-lg flex items-center gap-2 cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3,20.5V3.5C3,2.91,3.41,2.5,4,2.5c0.11,0,0.22,0.02,0.32,0.06l15,7.5c0.44,0.22,0.68,0.61,0.68,1.04 s-0.24,0.82-0.68,1.04l-15,7.5c-0.1,0.05-0.21,0.06-0.32,0.06C3.41,21.5,3,21.09,3,20.5z"/></svg>
                <div className="text-[10px]">Get it on <div className="text-sm font-bold">Google Play</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#DEE2E7] py-4">
        <div className="container-custom flex items-center justify-between text-[#505050]">
          <p>© 2023 Ecommerce.</p>
          <div className="flex items-center gap-1 cursor-pointer">
             <span className="text-xl">🇺🇸</span>
             <span>English</span>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
