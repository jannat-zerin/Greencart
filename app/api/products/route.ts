import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();
    const category = searchParams.get('category')?.trim();

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    await connectDB();
    const products = await Product.find(filter).sort({ id: 1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, image, category, description, healthiness, priceHonestyRating } = body;

    if (!name || !price || !image || !category) {
      return NextResponse.json(
        { error: 'Name, price, image, and category are required' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    await connectDB();

    const maxProduct = await Product.findOne({}).sort({ id: -1 }).select('id').lean();
    const nextId = (maxProduct?.id ?? 0) + 1;

    const product = new Product({
      id: nextId,
      name,
      price,
      image,
      category,
      description: description || '',
      healthiness: typeof healthiness === 'number' ? Math.max(0, Math.min(100, healthiness)) : undefined,
      priceHonestyRating: typeof priceHonestyRating === 'number' ? Math.max(0, Math.min(5, priceHonestyRating)) : undefined,
    });

    await product.save();
    return NextResponse.json(product.toJSON(), { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
