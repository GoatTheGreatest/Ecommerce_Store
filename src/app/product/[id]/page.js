'use client';

import { useState, useEffect, use } from 'react';
import { useCart } from '../../../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetail({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          setSelectedImage(data.image);
          
          // Fetch related products (matching category)
          const relRes = await fetch(`/api/products?category=${data.category}`);
          const relData = await relRes.json();
          setRelatedProducts(relData.filter(p => p._id !== data._id).slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) return <div className="container-custom py-20 text-center">Loading product...</div>;
  if (!product) return <div className="container-custom py-20 text-center text-[#EB001B]">Product not found</div>;

  return (
    <div className="bg-[#F7FAFC] min-h-screen pb-10">
      <div className="container-custom py-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-5">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/products">Clothings</Link>
          <span>›</span>
          <Link href="/products">Men&apos;s wear</Link>
          <span>›</span>
          <span className="text-foreground">Summer clothing</span>
        </div>

        {/* Main Product Section */}
        <div className="card p-5 grid grid-cols-1 lg:grid-cols-12 gap-10 mb-6">
          {/* Gallery */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white">
              <Image src={selectedImage || product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-contain p-10" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[(product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"), ...Array(4).fill(product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80")].map((img, i) => (
                <div 
                  key={i} 
                  className={`aspect-square border-2 rounded cursor-pointer overflow-hidden bg-white ${selectedImage === img ? 'border-primary' : 'border-gray-200'}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image src={img} alt="thumb" width={100} height={100} className="object-contain p-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 text-green-500 text-sm mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
              <span>{product.status || 'In stock'}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
               <div className="flex text-orange-400">
                  {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
               </div>
               <span className="text-orange-400">{product.rating}</span>
               <span className="text-gray-400">•</span>
               <span className="text-[#8B96A5] flex items-center gap-1">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                 {product.reviews} reviews
               </span>
               <span className="text-gray-400">•</span>
               <span className="text-[#8B96A5] flex items-center gap-1">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/></svg>
                 {product.sales} sold
               </span>
            </div>

            <div className="bg-[#FFF0DF] p-4 flex gap-10 mb-6">
               <div>
                  <p className="text-[#EB001B] text-xl font-bold">${product.price}</p>
                  <p className="text-xs text-[#505050]">50-100 pcs</p>
               </div>
               <div className="border-l border-gray-300 pl-10">
                  <p className="text-[#1C1C1C] text-xl font-bold">$90.00</p>
                  <p className="text-xs text-[#505050]">100-700 pcs</p>
               </div>
               <div className="border-l border-gray-300 pl-10">
                  <p className="text-[#1C1C1C] text-xl font-bold">$78.00</p>
                  <p className="text-xs text-[#505050]">700+ pcs</p>
               </div>
            </div>

            <div className="space-y-3 text-sm">
               <div className="flex gap-20 border-b border-gray-200 pb-2">
                 <span className="text-[#8B96A5] w-20">Price:</span>
                 <span className="text-[#505050]">Negotiable</span>
               </div>
               <div className="flex gap-20 border-b border-gray-200 pb-2">
                 <span className="text-[#8B96A5] w-20">Type:</span>
                 <span className="text-[#505050]">Classic shoes</span>
               </div>
               <div className="flex gap-20 border-b border-gray-200 pb-2">
                 <span className="text-[#8B96A5] w-20">Material:</span>
                 <span className="text-[#505050]">Plastic material</span>
               </div>
               <div className="flex gap-20 border-b border-gray-200 pb-2">
                 <span className="text-[#8B96A5] w-20">Design:</span>
                 <span className="text-[#505050]">Modern nice</span>
               </div>
            </div>
          </div>

          {/* Supplier Card */}
          <div className="lg:col-span-3">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
               <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-[#E3F0FF] rounded flex items-center justify-center text-xl font-bold text-primary">R</div>
                  <div>
                    <p className="text-[#1C1C1C] font-medium leading-tight">Supplier <br/> {product.supplierName}</p>
                  </div>
               </div>
               <div className="space-y-2 text-[#8B96A5] text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{product.supplierFlag}</span>
                    <span>{product.supplierRegion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span>Verified Seller</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>Worldwide shipping</span>
                  </div>
               </div>
               <button className="w-full btn-primary mb-2 text-sm">Send inquiry</button>
               <button className="w-full btn-outline text-sm">Seller&apos;s profile</button>
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 text-primary font-medium">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.044 3 5.5L12 21Z"/></svg>
               Save for later
            </button>
          </div>
        </div>

        {/* Tabs and Related */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
             <div className="card">
                <div className="flex border-b border-gray-200">
                   {['Description', 'Reviews', 'Shipping', 'About seller'].map((tab, i) => (
                     <button key={tab} className={`px-6 py-4 font-medium text-sm ${i === 0 ? 'text-primary border-b-2 border-primary' : 'text-[#8B96A5]'}`}>
                       {tab}
                     </button>
                   ))}
                </div>
                <div className="p-6 text-[#505050] space-y-4">
                   <p>{product.description}</p>
                   <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                   <table className="w-full max-w-md border-collapse border border-gray-200 text-sm">
                      <tbody>
                        <tr><td className="border border-gray-200 p-2 bg-gray-50 w-1/3">Model</td><td className="border border-gray-200 p-2">#8786867</td></tr>
                        <tr><td className="border border-gray-200 p-2 bg-gray-50">Style</td><td className="border border-gray-200 p-2">Classic style</td></tr>
                        <tr><td className="border border-gray-200 p-2 bg-gray-50">Certificate</td><td className="border border-gray-200 p-2">ISO-898921212</td></tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
          <div className="lg:col-span-1">
             <div className="card p-4">
                <h4 className="font-bold text-[#1C1C1C] mb-4">You may like</h4>
                <div className="space-y-4">
                    {relatedProducts.map(p => (
                      <Link href={`/product/${p._id}`} key={p._id} className="flex gap-3 group">
                         <div className="relative w-16 h-16 border border-gray-200 rounded overflow-hidden flex-shrink-0 bg-white">
                            <Image src={p.image} alt={p.name} fill sizes="64px" className="object-contain p-1" />
                         </div>
                         <div>
                            <p className="text-sm text-[#1C1C1C] line-clamp-1 group-hover:text-primary">{p.name}</p>
                            <p className="text-sm text-[#8B96A5]">${p.price} - $90.00</p>
                         </div>
                      </Link>
                    ))}
                </div>
             </div>
          </div>
        </div>

        {/* Related Products Grid */}
        <section className="mt-10">
           <h3 className="text-2xl font-bold mb-6 text-[#1C1C1C]">Related products</h3>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {relatedProducts.map(p => (
                 <Link href={`/product/${p._id}`} key={p._id} className="card p-3 hover:shadow-md transition-shadow">
                    <div className="relative aspect-square mb-3">
                       <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-contain" />
                    </div>
                    <p className="text-sm text-[#505050] line-clamp-1 mb-1">{p.name}</p>
                    <p className="text-sm text-[#8B96A5]">${p.price} - $90.00</p>
                 </Link>
               ))}
           </div>
        </section>

        {/* CTA Banner */}
        <div className="bg-[#237CFF] rounded-lg p-8 mt-10 flex flex-col md:flex-row justify-between items-center text-white gap-6">
           <div>
             <h3 className="text-xl font-bold">Super discount on more than 100 USD</h3>
             <p className="text-white/80">Have you ever finally just write dummy info</p>
           </div>
           <button className="bg-[#FF9017] text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">Shop now</button>
        </div>
      </div>
    </div>
  );
}