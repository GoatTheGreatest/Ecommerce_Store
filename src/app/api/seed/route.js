import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { products } from '../../../data/products';

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Admin mapping based on category
    const adminMap = {
      "Electronics": { supplierName: "TechAdmin", sellerName: "TechAdmin", supplierRegion: "USA, California", supplierFlag: "🇺🇸", supplierUrl: "techadmin.com" },
      "Machinery": { supplierName: "TechAdmin", sellerName: "TechAdmin", supplierRegion: "USA, California", supplierFlag: "🇺🇸", supplierUrl: "techadmin.com" },
      "Home & Outdoor": { supplierName: "HomeAdmin", sellerName: "HomeAdmin", supplierRegion: "UK, London", supplierFlag: "🇬🇧", supplierUrl: "homeadmin.co.uk" },
      "Clothing & Wear": { supplierName: "FashionAdmin", sellerName: "FashionAdmin", supplierRegion: "France, Paris", supplierFlag: "🇫🇷", supplierUrl: "fashionadmin.fr" },
      "Accessories": { supplierName: "FashionAdmin", sellerName: "FashionAdmin", supplierRegion: "France, Paris", supplierFlag: "🇫🇷", supplierUrl: "fashionadmin.fr" },
      "Automobiles": { supplierName: "AutoAdmin", sellerName: "AutoAdmin", supplierRegion: "Germany, Berlin", supplierFlag: "🇩🇪", supplierUrl: "autoadmin.de" },
      "Tools": { supplierName: "AutoAdmin", sellerName: "AutoAdmin", supplierRegion: "Germany, Berlin", supplierFlag: "🇩🇪", supplierUrl: "autoadmin.de" },
      "Sports": { supplierName: "SportsAdmin", sellerName: "SportsAdmin", supplierRegion: "Canada, Toronto", supplierFlag: "🇨🇦", supplierUrl: "sportsadmin.ca" },
      "Pets": { supplierName: "SportsAdmin", sellerName: "SportsAdmin", supplierRegion: "Canada, Toronto", supplierFlag: "🇨🇦", supplierUrl: "sportsadmin.ca" }
    };

    // Insert new products
    const seededProducts = await Product.insertMany(products.map(p => {
      const supplierInfo = adminMap[p.category] || { supplierName: "TechAdmin", sellerName: "TechAdmin", supplierRegion: "USA, California", supplierFlag: "🇺🇸", supplierUrl: "techadmin.com" };
      return {
        name: p.name,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice,
        image: p.image,
        category: p.category,
        subCategory: p.subCategory,
        rating: p.rating,
        reviews: p.reviews,
        sales: p.sales,
        status: p.status,
        ...supplierInfo
      };
    }));

    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      count: seededProducts.length 
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
