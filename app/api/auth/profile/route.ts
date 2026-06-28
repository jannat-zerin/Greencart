import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { getSession } from '@/lib/auth';
import {
  findMemoryUserByEmail,
  isMemoryAuthEnabled,
  toMemoryUserPayload,
  verifyMemoryPassword,
} from '@/lib/auth-store';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (isMemoryAuthEnabled()) {
    const email = typeof session.email === 'string' ? session.email : '';
    const user = await findMemoryUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(toMemoryUserPayload(user));
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

    if (isMemoryAuthEnabled()) {
      const email = typeof session.email === 'string' ? session.email : '';
      const user = await findMemoryUserByEmail(email);
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
        const valid = await verifyMemoryPassword(user, currentPassword);
        if (!valid) {
          return NextResponse.json(
            { error: 'Current password is incorrect' },
            { status: 400 }
          );
        }
        user.password = await bcrypt.hash(newPassword, 12);
      }

      return NextResponse.json({
        message: 'Profile updated successfully',
        user: toMemoryUserPayload(user),
      });
    }

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
