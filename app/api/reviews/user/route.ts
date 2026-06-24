import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/models/Review';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await connectDB();
    const reviews = await Review.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Failed to fetch user reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
