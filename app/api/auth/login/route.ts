import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { signJWT, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await signJWT({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      message: 'Logged in successfully',
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
