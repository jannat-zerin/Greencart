import { NextResponse } from 'next/server';
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
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
