import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Feedback } from '@/lib/models/Feedback';
import { getSession } from '@/lib/auth';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const session = await getSession();

    const feedback = await Feedback.create({
      userId: session?.id,
      name,
      email,
      message,
    });

    return NextResponse.json({ success: true, id: feedback._id.toString() });
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

// GET: admin shob feedback dekhbe
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    await connectDB();
    const feedbacks = await Feedback.find({})
      .sort({ createdAt: -1 })
      .lean();

    const mapped = feedbacks.map((f) => ({
      id: f._id.toString(),
      name: f.name,
      email: f.email,
      message: f.message,
      status: f.status,
      createdAt: f.createdAt,
    }));

    return NextResponse.json({ feedbacks: mapped });
  } catch (error) {
    console.error('Failed to fetch feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}