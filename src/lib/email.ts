import { Resend } from 'resend';
import {
  getVerificationEmailTemplate,
  getMagicLinkEmailTemplate,
  getPasswordResetEmailTemplate,
  getInvitationEmailTemplate,
} from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const html = getVerificationEmailTemplate(token);
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email address',
      html,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending verification email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const html = getPasswordResetEmailTemplate(token);
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html,
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

export async function sendMagicLinkEmail(email: string, token: string) {
  try {
    const html = getMagicLinkEmailTemplate(token);
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Sign in to your account',
      html,
    });

    if (error) {
      console.error('Error sending magic link email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending magic link email:', error);
    return { success: false, error };
  }
}

export async function sendInvitationEmail(
  email: string,
  token: string,
  organizationName: string,
  inviterName: string
) {
  try {
    const html = getInvitationEmailTemplate(token, organizationName, inviterName);
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `You've been invited to join ${organizationName}`,
      html,
    });

    if (error) {
      console.error('Error sending invitation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending invitation email:', error);
    return { success: false, error };
  }
}