import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Product ID must be a valid number' },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findOne({ id: numericId }).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Product ID must be a valid number' },
        { status: 400 }
      );
    }

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

    const product = await Product.findOne({ id: numericId });
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    product.name = name;
    product.price = price;
    product.image = image;
    product.category = category;
    product.description = description || '';
    product.healthiness = typeof healthiness === 'number' ? Math.max(0, Math.min(100, healthiness)) : product.healthiness;
    product.priceHonestyRating = typeof priceHonestyRating === 'number' ? Math.max(0, Math.min(5, priceHonestyRating)) : product.priceHonestyRating;

    await product.save();
    return NextResponse.json(product.toJSON());
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
