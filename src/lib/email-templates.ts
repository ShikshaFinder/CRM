/**
 * Branded email template components
 * These templates provide consistent branding across all email communications
 */

export function getEmailTemplate({
  title,
  heading,
  content,
  buttonText,
  buttonUrl,
  footerText,
  expiryText,
}: {
  title: string;
  heading: string;
  content: string;
  buttonText: string;
  buttonUrl: string;
  footerText?: string;
  expiryText?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; border-spacing: 0; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; border-spacing: 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <div style="display: inline-block; width: 48px; height: 48px; background-color: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 28px;">🥛</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Flavi CRM</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600; line-height: 1.3;">
                ${heading}
              </h2>
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                ${content}
              </p>
              
              <!-- Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; border-spacing: 0; margin: 0 0 30px;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${buttonUrl}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      ${buttonText}
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px; padding: 12px; background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                <a href="${buttonUrl}" style="color: #2563eb; text-decoration: none; word-break: break-all; font-size: 13px; font-family: 'Courier New', monospace;">
                  ${buttonUrl}
                </a>
              </p>
              
              ${expiryText ? `
              <div style="margin: 30px 0 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                  ⏰ ${expiryText}
                </p>
              </div>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px; line-height: 1.5; text-align: center;">
                ${footerText || "If you didn't request this, you can safely ignore this email."}
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                © ${new Date().getFullYear()} Flavi CRM. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getVerificationEmailTemplate(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  return getEmailTemplate({
    title: 'Verify your email address',
    heading: 'Verify Your Email Address',
    content: 'Thank you for signing up for Flavi CRM! Please click the button below to verify your email address and activate your account.',
    buttonText: 'Verify Email Address',
    buttonUrl: verificationUrl,
    footerText: "If you didn't create an account, you can safely ignore this email.",
    expiryText: 'This verification link will expire in 24 hours.',
  });
}

export function getMagicLinkEmailTemplate(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const magicLinkUrl = `${baseUrl}/api/auth/magic-login?token=${token}`;

  return getEmailTemplate({
    title: 'Sign in to your account',
    heading: 'Sign In to Your Account',
    content: 'Click the button below to sign in to your Flavi CRM account. No password needed!',
    buttonText: 'Sign In',
    buttonUrl: magicLinkUrl,
    footerText: "If you didn't request this magic link, you can safely ignore this email.",
    expiryText: 'This magic link will expire in 15 minutes.',
  });
}

export function getPasswordResetEmailTemplate(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  return getEmailTemplate({
    title: 'Reset your password',
    heading: 'Reset Your Password',
    content: 'You requested to reset your password for your Flavi CRM account. Click the button below to create a new password.',
    buttonText: 'Reset Password',
    buttonUrl: resetUrl,
    footerText: "If you didn't request a password reset, you can safely ignore this email.",
    expiryText: 'This password reset link will expire in 1 hour.',
  });
}

export function getInvitationEmailTemplate(
  token: string,
  organizationName: string,
  inviterName: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const acceptUrl = `${baseUrl}/accept-invite?token=${token}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>You've been invited to join ${organizationName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; border-spacing: 0; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; border-spacing: 0; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <div style="display: inline-block; width: 48px; height: 48px; background-color: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 28px;">👥</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Flavi CRM</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600; line-height: 1.3;">
                You've Been Invited!
              </h2>
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                <strong style="color: #1a1a1a;">${inviterName}</strong> has invited you to join <strong style="color: #1a1a1a;">${organizationName}</strong> on Flavi CRM.
              </p>
              <p style="margin: 0 0 30px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Click the button below to accept the invitation and join the team.
              </p>
              
              <!-- Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; border-spacing: 0; margin: 0 0 30px;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${acceptUrl}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Alternative Link -->
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px; padding: 12px; background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
                <a href="${acceptUrl}" style="color: #2563eb; text-decoration: none; word-break: break-all; font-size: 13px; font-family: 'Courier New', monospace;">
                  ${acceptUrl}
                </a>
              </p>
              
              <div style="margin: 30px 0 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                  ⏰ This invitation will expire in 7 days.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px; line-height: 1.5; text-align: center;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5; text-align: center;">
                © ${new Date().getFullYear()} Flavi CRM. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

