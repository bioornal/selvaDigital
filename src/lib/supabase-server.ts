import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import fs from 'fs';
import path from 'path';

function loadEnvVar(key: string): string | undefined {
  // 1. Runtime env (Vercel, production)
  if (process.env[key]) return process.env[key];

  // 2. Leer .env file directamente (desarrollo local)
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(new RegExp(`^${key}=([^\r\n]+)`, 'm'));
    if (match) return match[1].trim();
  } catch {
    // .env no existe o no se puede leer
  }

  return undefined;
}

const supabaseUrl = loadEnvVar('PUBLIC_SUPABASE_URL') || '';
const supabaseServiceRoleKey = loadEnvVar('SUPABASE_SERVICE_ROLE_KEY') || '';

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
