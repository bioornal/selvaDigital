-- ========================================================
-- Selva Digital - Unification Database Migration Script
-- Run this in your Supabase SQL Editor.
-- ========================================================

-- 1. Add access_code column to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;

-- Create index for faster lookups by access_code
CREATE INDEX IF NOT EXISTS idx_clients_access_code ON public.clients(access_code);

-- Drop old tables if they exist to prevent column clashes with older/partial setups
DROP TABLE IF EXISTS public.client_brand_info CASCADE;
DROP TABLE IF EXISTS public.uploaded_files CASCADE;
DROP TABLE IF EXISTS public.business_info CASCADE;

-- 2. Create client_brand_info table (1-to-1 with clients)
CREATE TABLE public.client_brand_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE CONSTRAINT unique_client_info UNIQUE,
    brand_name TEXT NOT NULL,
    tagline TEXT,
    brand_colors TEXT,
    description TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    social_links JSONB DEFAULT '{}'::jsonb NOT NULL,
    reference_sites JSONB DEFAULT '[]'::jsonb NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for client_brand_info updated_at
DROP TRIGGER IF EXISTS update_client_brand_info_updated_at ON public.client_brand_info;
CREATE TRIGGER update_client_brand_info_updated_at BEFORE UPDATE ON public.client_brand_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Create uploaded_files table (1-to-many with clients)
CREATE TABLE public.uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('logo', 'hero_banner', 'product_gallery', 'general_asset')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by client_id
CREATE INDEX IF NOT EXISTS idx_files_client_id ON public.uploaded_files(client_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.client_brand_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for clients, client_brand_info, and uploaded_files
DROP POLICY IF EXISTS "Client SELECT matching client" ON public.clients;
DROP POLICY IF EXISTS "Admin full access client_brand_info" ON public.client_brand_info;
DROP POLICY IF EXISTS "Client SELECT brand_info" ON public.client_brand_info;
DROP POLICY IF EXISTS "Client INSERT brand_info" ON public.client_brand_info;
DROP POLICY IF EXISTS "Client UPDATE brand_info" ON public.client_brand_info;
DROP POLICY IF EXISTS "Admin full access uploaded_files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Client SELECT uploaded_files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Client INSERT uploaded_files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Client DELETE uploaded_files" ON public.uploaded_files;

-- 5. Create RLS Policies

-- 5.1 CLIENTS POLICIES (anon SELECT based on access-code header)
CREATE POLICY "Client SELECT matching client" ON public.clients 
    FOR SELECT TO anon 
    USING (access_code = current_setting('request.headers', true)::json->>'x-client-code');

-- Client UPDATE is not needed for anon as it is handled securely on the server-side (/api/notify)

-- 5.2 CLIENT BRAND INFO POLICIES
-- Admin gets full access
CREATE POLICY "Admin full access client_brand_info" ON public.client_brand_info 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Client select brand info
CREATE POLICY "Client SELECT brand_info" ON public.client_brand_info 
    FOR SELECT TO anon 
    USING (client_id IN (
        SELECT id FROM public.clients 
        WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
    ));

-- Client insert brand info
CREATE POLICY "Client INSERT brand_info" ON public.client_brand_info 
    FOR INSERT TO anon 
    WITH CHECK (client_id IN (
        SELECT id FROM public.clients 
        WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
    ));

-- Client update brand info
CREATE POLICY "Client UPDATE brand_info" ON public.client_brand_info 
    FOR UPDATE TO anon 
    USING (client_id IN (
        SELECT id FROM public.clients 
        WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
    ))
    WITH CHECK (client_id IN (
        SELECT id FROM public.clients 
        WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
    ));

-- 5.3 UPLOADED FILES POLICIES
-- Admin gets full access
CREATE POLICY "Admin full access uploaded_files" ON public.uploaded_files 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Client select uploaded files
CREATE POLICY "Client SELECT uploaded_files" ON public.uploaded_files 
    FOR SELECT TO anon 
    USING (client_id IN (
        SELECT id FROM public.clients 
        WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
    ));

-- Client insert uploaded files
CREATE POLICY "Client INSERT uploaded_files" ON public.uploaded_files 
    FOR INSERT TO anon 
    WITH CHECK (client_id IN (
        SELECT id FROM public.clients 
        WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
    ));

-- Client delete uploaded files
CREATE POLICY "Client DELETE uploaded_files" ON public.uploaded_files 
    FOR DELETE TO anon 
    USING (client_id IN (
        SELECT id FROM public.clients 
        WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
    ));

-- ========================================================
-- 6. Storage Setup & Security Policies for client-assets
-- ========================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-assets', 'client-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Clean existing storage policies
DROP POLICY IF EXISTS "Allow Admin and Client Read" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin and Client Insert" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admin and Client Delete" ON storage.objects;

-- Allow reading files if authenticated or if folder name matches client id verified by access code header
CREATE POLICY "Allow Admin and Client Read" 
ON storage.objects FOR SELECT 
USING (
    bucket_id = 'client-assets'
    AND (
        auth.role() = 'authenticated'
        OR (storage.foldername(name))[1] IN (
            SELECT id::text FROM public.clients 
            WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
        )
    )
);

-- Allow inserting files if authenticated or client folder name matches
CREATE POLICY "Allow Admin and Client Insert" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'client-assets'
    AND (
        auth.role() = 'authenticated'
        OR (storage.foldername(name))[1] IN (
            SELECT id::text FROM public.clients 
            WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
        )
    )
);

-- Allow deleting files if authenticated or client folder name matches
CREATE POLICY "Allow Admin and Client Delete" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'client-assets'
    AND (
        auth.role() = 'authenticated'
        OR (storage.foldername(name))[1] IN (
            SELECT id::text FROM public.clients 
            WHERE access_code = current_setting('request.headers', true)::json->>'x-client-code'
        )
    )
);

-- ========================================================
-- 7. Grant Table Permissions to Anon and Authenticated Roles
-- ========================================================
-- Grant read access on clients to anon (RLS policies will restrict which row they can read)
GRANT SELECT ON public.clients TO anon;
GRANT SELECT, UPDATE, INSERT, DELETE ON public.clients TO authenticated;

-- Grant access on client_brand_info
GRANT SELECT, INSERT, UPDATE ON public.client_brand_info TO anon;
GRANT ALL ON public.client_brand_info TO authenticated;

-- Grant access on uploaded_files
GRANT SELECT, INSERT, DELETE ON public.uploaded_files TO anon;
GRANT ALL ON public.uploaded_files TO authenticated;
