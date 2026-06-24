import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { Order } from '@/lib/models/Order';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  try {
    await connectDB();

    if (productId) {
      const numericId = parseInt(productId);
      if (isNaN(numericId)) {
        return NextResponse.json(
          { error: 'Invalid product ID' },
          { status: 400 }
        );
      }
      const reviews = await Review.find({ productId: numericId })
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json({ reviews });
    }

    return NextResponse.json({ reviews: [] });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating) {
      return NextResponse.json(
        { error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Review.findOne({
      userId: session.id,
      productId,
    });
    if (existing) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    const orderWithProduct = await Order.findOne({
      userId: session.id,
      'items.productId': productId,
    });
    if (!orderWithProduct) {
      return NextResponse.json(
        { error: 'You can only review products you have purchased' },
        { status: 403 }
      );
    }

    const review = new Review({
      userId: session.id,
      userEmail: session.email,
      userName: '',
      productId,
      rating,
      comment: comment || '',
    });

    await review.save();

    return NextResponse.json(
      {
        message: 'Review created successfully',
        review: {
          id: review._id.toString(),
          userId: review.userId,
          userEmail: review.userEmail,
          userName: review.userName,
          productId: review.productId,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
