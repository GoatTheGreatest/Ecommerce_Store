import Image from "next/image";
import Link from "next/link";

export default function CategorySection({ title, image, items, categoryName }) {
  return (
    <section className="card flex flex-col md:flex-row overflow-hidden h-auto md:h-[257px]">
      {/* Left Sidebar */}
      <div className="relative w-full md:w-[280px] min-h-[150px] md:min-h-full">
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 280px" className="object-cover" />
        <div className="absolute inset-0 bg-black/10 p-5">
          <h3 className="text-xl font-bold text-[#1C1C1C] mb-4 max-w-[150px]">{title}</h3>
          <button className="bg-white text-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
            Source now
          </button>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
        {items.map((item, i) => (
          <Link 
            href={`/products?category=${categoryName}&sub=${item.sub}`} 
            key={i} 
            className="p-4 flex flex-col justify-between hover:bg-gray-50 transition-colors border-b lg:border-b-0"
          >
            <div>
              <p className="text-[#1C1C1C] font-medium text-sm mb-1">{item.name}</p>
              <p className="text-[#8B96A5] text-xs">From <br/> USD {item.price}</p>
            </div>
            <div className="relative w-20 h-20 self-end">
              <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
