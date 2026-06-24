import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@greencart.com')
  .split(',')
  .map((e: string) => e.trim().toLowerCase());

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';

    const user = new User({ email, password, name: name || '', role });
    await user.save();

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { email: user.email, name: user.name, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
