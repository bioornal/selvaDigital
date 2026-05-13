-- Script de diagnóstico y fix para permisos de RLS
-- Ejecutar esto en SQL Editor de Supabase

-- 1. Ver si RLS está habilitado
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname IN ('clients', 'project_phases', 'messages');

-- 2. Ver políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('clients', 'project_phases', 'messages');

-- 3. Eliminar políticas existentes para recrearlas limpio
DROP POLICY IF EXISTS "Allow authenticated read clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated insert clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated update clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated delete clients" ON clients;

DROP POLICY IF EXISTS "Allow authenticated read phases" ON project_phases;
DROP POLICY IF EXISTS "Allow authenticated insert phases" ON project_phases;
DROP POLICY IF EXISTS "Allow authenticated update phases" ON project_phases;
DROP POLICY IF EXISTS "Allow authenticated delete phases" ON project_phases;

DROP POLICY IF EXISTS "Allow authenticated read messages" ON messages;
DROP POLICY IF EXISTS "Allow authenticated insert messages" ON messages;
DROP POLICY IF EXISTS "Allow authenticated update messages" ON messages;
DROP POLICY IF EXISTS "Allow authenticated delete messages" ON messages;

-- 4. Asegurar que RLS está habilitado
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 5. Forzar RLS incluso para el dueño de la tabla
ALTER TABLE clients FORCE ROW LEVEL SECURITY;
ALTER TABLE project_phases FORCE ROW LEVEL SECURITY;
ALTER TABLE messages FORCE ROW LEVEL SECURITY;

-- 6. Recrear políticas (todas las operaciones para usuarios autenticados)
CREATE POLICY "Allow authenticated all clients" ON clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated all phases" ON project_phases
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated all messages" ON messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Verificar que quedaron bien
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('clients', 'project_phases', 'messages');
