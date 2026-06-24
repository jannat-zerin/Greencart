import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';

export async function GET() {
  try {
    await connectDB();
    const categories = await Product.distinct('category');
    return NextResponse.json({ categories: categories.sort() });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
