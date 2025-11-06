import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email address',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
              <h1 style="color: #000000; font-size: 24px; margin-bottom: 20px;">Verify Your Email Address</h1>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Thank you for signing up! Please click the button below to verify your email address and activate your account.
              </p>
              <a href="${verificationUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-bottom: 30px;">
                Verify Email Address
              </a>
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #666666; font-size: 12px; word-break: break-all;">
                ${verificationUrl}
              </p>
              <p style="color: #999999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
              <h1 style="color: #000000; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h1>
              <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                You requested to reset your password. Click the button below to create a new password.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-bottom: 30px;">
                Reset Password
              </a>
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #666666; font-size: 12px; word-break: break-all;">
                ${resetUrl}
              </p>
              <p style="color: #999999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                This password reset link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending password reset email:', error);
    return { success: false, error };
  }
}
