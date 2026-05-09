"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-[#FFE3E3] text-[#EB001B] px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm animate-pulse">
            -{product.discountPercent}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#1C1C1C]">
              ${product.price}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-red-500 line-through decoration-red-500 decoration-dashed decoration-1 font-bold">
                ${product.oldPrice}
              </span>
            )}
          </div>
          <div className="space-x-2">
            <Link
              href={`/product/${product.id}`}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
            >
              View
            </Link>
            <button
              onClick={handleAddToCart}
              className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
