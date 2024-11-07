import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  env: z.enum(['development', 'test', 'production']).default('development'),
  port: z.number().default(3000),
  jwt: z.object({
    secret: z.string(),
    expiresIn: z.string().default('1d')
  }),
  supabase: z.object({
    url: z.string(),
    serviceKey: z.string(),
    anonKey: z.string()
  }),
  cors: z.object({
    origin: z.string()
  })
});

export const config = configSchema.parse({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    anonKey: process.env.SUPABASE_ANON_KEY
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  }
});