import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.id).select('-password').lean();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    address: user.address,
  });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, address, currentPassword, newPassword } = body;

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters' },
          { status: 400 }
        );
      }
      const valid = await user.comparePassword(currentPassword);
      if (!valid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }
      user.password = newPassword;
    }

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error('Profile update failed:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
