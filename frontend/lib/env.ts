const requiredServerVars = ['DATABASE_URL', 'JWT_SECRET'] as const;
const isLocalDevelopment = process.env.NODE_ENV !== 'production' && !process.env.VERCEL_ENV;

export function getRequiredEnv(name: (typeof requiredServerVars)[number] | 'DIRECT_URL' | 'CSRF_SECRET') {
  const value = process.env[name];
  if (!value && !isLocalDevelopment) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  jwtSecret: isLocalDevelopment ? getRequiredEnv('JWT_SECRET') || 'local-development-secret-change-me' : getRequiredEnv('JWT_SECRET'),
  csrfSecret: process.env.CSRF_SECRET || 'local-development-csrf-change-me',
  blobToken: process.env.BLOB_READ_WRITE_TOKEN || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  resendToEmail: process.env.RESEND_TO_EMAIL || '',
};
