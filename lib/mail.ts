import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'no-reply@greencart.com';

const createTransport = () => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transporter = createTransport();

  if (!transporter) {
    console.warn('SMTP credentials are not configured. Password reset email was not sent.');
    return { ok: false, reason: 'smtp-not-configured' };
  }

  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: 'Reset your GreenCart password',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="color: #16a34a;">Reset your password</h2>
        <p>We received a request to reset your password for GreenCart.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 16px; background: #16a34a; color: white; text-decoration: none; border-radius: 6px;">
            Create a new password
          </a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return { ok: true };
}
