import NextImage from "next/image";
import Link from "next/link";

export default function CategorySection({ title, image, items, categoryName }) {
  return (
    <section className="card flex flex-col md:flex-row overflow-hidden min-h-[257px]">
      {/* Left Sidebar */}
      <div className="relative w-full md:w-[280px] min-h-[150px] md:min-h-full">
        <NextImage src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 280px" className="object-cover" />
        <div className="absolute inset-0 p-5 bg-black/5">
          <h3 className="text-xl font-bold text-[#1C1C1C] mb-4 max-w-[150px] leading-tight">{title}</h3>
          <Link 
            href={`/products?category=${categoryName}`}
            className="bg-white text-[#1C1C1C] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors shadow-sm inline-block"
          >
            Source now
          </Link>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-gray-200">
        {items.slice(0, 8).map((item, i) => (
          <Link 
            href={`/products?category=${categoryName}&sub=${item.sub || ""}`} 
            key={i} 
            className="p-4 flex flex-col justify-between hover:bg-gray-50 transition-colors bg-white min-h-[128px]"
          >
            <div className="flex flex-col gap-0.5">
              <p className="text-[#1C1C1C] text-sm font-normal line-clamp-1">{item.name}</p>
              <div className="text-[#8B96A5] text-[13px] leading-tight">
                From <br/> 
                <span className="text-[#8B96A5]">USD {item.price}</span>
              </div>
            </div>
            <div className="relative w-[80px] h-[80px] self-end mt-1">
              <NextImage 
                src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"} 
                alt={item.name} 
                fill 
                sizes="80px" 
                className="object-contain" 
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
