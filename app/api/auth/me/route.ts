import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.id).lean();

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
    },
  });
}
