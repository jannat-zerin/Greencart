import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import {
  clearMemoryResetToken,
  findMemoryUserByResetToken,
  isMemoryAuthEnabled,
  updateMemoryPassword,
} from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (isMemoryAuthEnabled()) {
      const user = await findMemoryUserByResetToken(token);
      if (!user) {
        return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
      }

      await updateMemoryPassword(user.email, password);
      await clearMemoryResetToken(user.email);
      return NextResponse.json({ message: 'Password updated successfully' });
    }

    await connectDB();
    const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = '';
    user.resetTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password failed:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
