import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import {
  findMemoryUserByEmail,
  isMemoryAuthEnabled,
  toMemoryUserPayload,
} from '@/lib/auth-store';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  if (isMemoryAuthEnabled()) {
    const email = typeof session.email === 'string' ? session.email : '';
    const user = await findMemoryUserByEmail(email);

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: toMemoryUserPayload(user),
    });
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
