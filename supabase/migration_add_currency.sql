-- ========================================================
-- Selva Digital - Add Currency Column to Clients Table
-- Run this in your Supabase SQL Editor.
-- ========================================================

ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'ARS'));
