import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
  // Core App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('AstralCore Hyperdrive'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('5.0.0'),
  
  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Database
  DATABASE_URL: z.string().optional(),
  POSTGRES_URL: z.string().optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_TRADING: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_DEPOSITS: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_WITHDRAWALS: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_CHAT: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z.coerce.boolean().default(true),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(false),
  
  // Analytics
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  HOTJAR_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  
  // AI & Genkit
  GOOGLE_GENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  
  // Development
  NEXT_PUBLIC_DEBUG_MODE: z.coerce.boolean().default(false),
  SKIP_ENV_VALIDATION: z.coerce.boolean().default(false),
});

// Type for validated environment variables
export type Env = z.infer<typeof envSchema>;

// Function to validate environment variables
export function validateEnv(): Env {
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    console.warn('⚠️ Skipping environment validation');
    return process.env as any;
  }

  try {
    const env = envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
      });
      
      // In production, throw the error to prevent startup
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Environment validation failed. Check your environment variables.');
      }
      
      // In development, warn but continue
      console.warn('⚠️ Continuing with invalid environment variables in development mode');
      return process.env as any;
    }
    
    throw error;
  }
}

// Validated environment variables
export const env = validateEnv();

// Helper functions for common checks
export const isProduction = () => env.NODE_ENV === 'production';
export const isDevelopment = () => env.NODE_ENV === 'development';
export const isTest = () => env.NODE_ENV === 'test';

// Feature flag helpers
export const features = {
  trading: env.NEXT_PUBLIC_ENABLE_TRADING,
  deposits: env.NEXT_PUBLIC_ENABLE_DEPOSITS,
  withdrawals: env.NEXT_PUBLIC_ENABLE_WITHDRAWALS,
  chat: env.NEXT_PUBLIC_ENABLE_CHAT,
  notifications: env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  debugMode: env.NEXT_PUBLIC_DEBUG_MODE,
} as const;

// Required environment variables for production deployment
export const REQUIRED_PROD_VARS = [
  'JWT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
] as const;

// Check if all required production variables are set
export function validateProductionEnv(): boolean {
  if (!isProduction()) return true;
  
  const missing = REQUIRED_PROD_VARS.filter(
    (varName) => !process.env[varName] || process.env[varName]?.trim() === ''
  );
  
  if (missing.length > 0) {
    console.error('❌ Missing required production environment variables:');
    missing.forEach((varName) => {
      console.error(`  - ${varName}`);
    });
    return false;
  }
  
  return true;
}

// Environment info for debugging
export function getEnvInfo() {
  return {
    nodeEnv: env.NODE_ENV,
    appName: env.NEXT_PUBLIC_APP_NAME,
    appVersion: env.NEXT_PUBLIC_APP_VERSION,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    features,
    hasDatabase: !!env.DATABASE_URL,
    hasEmail: !!(env.SMTP_HOST && env.SMTP_USER),
    hasAnalytics: !!env.GOOGLE_ANALYTICS_ID,
    hasSentry: !!env.SENTRY_DSN,
  };
}
