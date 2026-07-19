import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import {
  findMemoryUserById,
  isMemoryAuthEnabled,
  listMemoryUsers,
} from '@/lib/auth-store';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    if (isMemoryAuthEnabled()) {
      const users = listMemoryUsers().map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status || 'active',
        createdAt: user.createdAt,
      }));

      return NextResponse.json({ users });
    }

    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      users: users.map((user: any) => ({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        status: user.status || 'active',
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'User ID and action are required' }, { status: 400 });
    }

    if (isMemoryAuthEnabled()) {
      const targetUser = await findMemoryUserById(userId);
      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (action === 'demote' && session.email === targetUser.email) {
        return NextResponse.json({ error: 'You cannot remove your own admin access' }, { status: 400 });
      }

      if (action === 'block') {
        targetUser.status = 'blocked';
      } else if (action === 'unblock') {
        targetUser.status = 'active';
      } else if (action === 'promote') {
        targetUser.role = 'admin';
      } else if (action === 'demote') {
        targetUser.role = 'user';
      } else {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }

      return NextResponse.json({
        user: {
          id: targetUser.id,
          email: targetUser.email,
          name: targetUser.name,
          phone: targetUser.phone,
          address: targetUser.address,
          role: targetUser.role,
          status: targetUser.status || 'active',
          createdAt: targetUser.createdAt,
        },
      });
    }

    await connectDB();

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'demote' && session.id === userId) {
      return NextResponse.json({ error: 'You cannot remove your own admin access' }, { status: 400 });
    }

    if (action === 'block') {
      targetUser.status = 'blocked';
    } else if (action === 'unblock') {
      targetUser.status = 'active';
    } else if (action === 'promote') {
      targetUser.role = 'admin';
    } else if (action === 'demote') {
      targetUser.role = 'user';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await targetUser.save();

    return NextResponse.json({
      user: {
        id: targetUser._id.toString(),
        email: targetUser.email,
        name: targetUser.name,
        phone: targetUser.phone,
        address: targetUser.address,
        role: targetUser.role,
        status: targetUser.status || 'active',
        createdAt: targetUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
