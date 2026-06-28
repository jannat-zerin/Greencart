import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { sendPasswordResetEmail } from '@/lib/mail';
import {
  findMemoryUserByEmail,
  isMemoryAuthEnabled,
  setMemoryResetToken,
} from '@/lib/auth-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (isMemoryAuthEnabled()) {
      const user = await findMemoryUserByEmail(email);
      if (!user) {
        return NextResponse.json({ message: 'If an account exists, a reset email has been sent.' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
      await setMemoryResetToken(email, token, expiresAt);

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
      const mailResult = await sendPasswordResetEmail(email, resetUrl);

      if (!mailResult.ok) {
        console.log('Password reset URL (email not configured):', resetUrl);
        return NextResponse.json({
          message: 'Password reset link generated. Open the link below to continue.',
          resetUrl,
        });
      }

      return NextResponse.json({ message: 'If an account exists, a reset email has been sent.' });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a reset email has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    user.resetToken = token;
    user.resetTokenExpires = expiresAt;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    const mailResult = await sendPasswordResetEmail(email, resetUrl);

    if (!mailResult.ok) {
      console.log('Password reset URL (email not configured):', resetUrl);
      return NextResponse.json({
        message: 'Password reset link generated. Open the link below to continue.',
        resetUrl,
      });
    }

    return NextResponse.json({ message: 'If an account exists, a reset email has been sent.' });
  } catch (error) {
    console.error('Forgot password failed:', error);
    return NextResponse.json({ error: 'Failed to send password reset email' }, { status: 500 });
  }
}
