import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Supabase client singleton.
 * Returns `null` if env vars are not configured — the app falls back to localStorage.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/*
 * ── Database Setup ──────────────────────────────────────────
 * Run this SQL in the Supabase SQL Editor to create the listings table:
 *
 * create table listings (
 *   id text primary key,
 *   price numeric not null,
 *   address text not null,
 *   lat double precision not null,
 *   lng double precision not null,
 *   availability_start date not null,
 *   availability_end date not null,
 *   image_url text not null,
 *   images text[] not null default '{}',
 *   lister_name text not null default '',
 *   description text not null default '',
 *   contact_email text not null default '',
 *   contact_phone text not null default '',
 *   created_at timestamptz not null default now()
 * );
 *
 * alter table listings enable row level security;
 * create policy "Anyone can read listings" on listings for select using (true);
 * create policy "Anyone can insert listings" on listings for insert with check (true);
 */
