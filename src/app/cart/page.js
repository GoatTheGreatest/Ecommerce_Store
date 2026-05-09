"use client";

import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { products } from "../../data/products";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const savedForLater = products.slice(0, 4);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeFromCart(id);
    }
  };

  return (
    <div className="bg-[#F7FAFC] min-h-screen pb-10">
      <div className="container-custom py-5">
        <h1 className="text-2xl font-bold text-[#1C1C1C] mb-6">My cart ({items.length})</h1>

        {items.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-gray-600 mb-5">Your cart is empty.</p>
            <Link href="/products" className="btn-primary inline-block">Back to shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-9">
              <div className="card p-5 space-y-5">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex gap-5 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <div className="relative w-20 h-20 border border-gray-200 rounded overflow-hidden flex-shrink-0 bg-white">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-[#1C1C1C] mb-1">{item.name}</h3>
                          <p className="text-sm text-[#8B96A5]">Size: medium, Color: blue, Material: Plastic</p>
                          <p className="text-sm text-[#8B96A5]">Seller: Artel Market</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#1C1C1C]">${item.price}</p>
                          <select 
                            value={item.quantity} 
                            onChange={(e) => handleQuantityChange(item._id || item.id, parseInt(e.target.value))}
                            className="mt-2 border border-gray-300 rounded p-1 text-sm outline-none bg-white"
                          >
                             {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-4">
                        <button 
                          onClick={() => removeFromCart(item._id || item.id)}
                          className="text-[#EB001B] text-sm font-medium border border-gray-200 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                        <button className="text-primary text-sm font-medium border border-gray-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                  <Link href="/products" className="btn-primary py-2 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                    Back to shop
                  </Link>
                  <button className="text-primary font-medium border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                    Remove all
                  </button>
                </div>
              </div>

              {/* Service Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                {[
                  { title: "Secure payment", desc: "Have you ever finally just", icon: "🛡️" },
                  { title: "Customer support", desc: "Have you ever finally just", icon: "💬" },
                  { title: "Free delivery", desc: "Have you ever finally just", icon: "🚚" }
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#DEE2E7] rounded-full flex items-center justify-center text-xl">{s.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-[#1C1C1C]">{s.title}</p>
                      <p className="text-xs text-[#8B96A5]">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-3 space-y-4">
              <div className="card p-5">
                <p className="text-sm text-[#505050] mb-3">Have a coupon?</p>
                <div className="flex border border-gray-300 rounded overflow-hidden mb-5">
                  <input type="text" placeholder="Add coupon" className="flex-1 p-2 text-sm outline-none" />
                  <button className="bg-white text-primary border-l border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-50 transition-colors">Apply</button>
                </div>
                
                <div className="space-y-2 text-[#505050] text-sm pb-4 border-b border-gray-100 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#EB001B]">
                    <span>Discount:</span>
                    <span>- $60.00</span>
                  </div>
                  <div className="flex justify-between text-[#00B517]">
                    <span>Tax:</span>
                    <span>+ $14.00</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-lg text-[#1C1C1C] mb-5">
                  <span>Total:</span>
                  <span>${(getTotal() - 60 + 14).toFixed(2)}</span>
                </div>

                <button className="w-full bg-[#00B517] text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md">
                  Checkout
                </button>
                
                <div className="flex justify-center gap-2 mt-4">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-5 bg-gray-200 rounded"></div>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved for later */}
        <section className="mt-10">
           <div className="card p-5">
              <h3 className="text-xl font-bold text-[#1C1C1C] mb-6">Saved for later</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                 {savedForLater.map(p => (
                   <div key={p.id} className="space-y-3">
                      <div className="relative aspect-square bg-[#EEEEEE] rounded-lg overflow-hidden group">
                         <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain p-5" />
                         <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div>
                         <p className="font-bold text-[#1C1C1C]">${p.price}</p>
                         <p className="text-[#8B96A5] text-sm line-clamp-2">{p.name}</p>
                         <button className="mt-3 flex items-center gap-2 text-primary font-medium text-sm border border-gray-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            Move to cart
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
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
