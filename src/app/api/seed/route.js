import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { products } from '../../../data/products';

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new products
    const seededProducts = await Product.insertMany(products.map(p => ({
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
      // Default supplier info
      supplierName: 'Guanjoy Trading LLC',
      supplierRegion: 'Germany, Berlin',
      supplierFlag: '🇩🇪',
      supplierUrl: 'shopname.ae'
    })));

    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      count: seededProducts.length 
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
