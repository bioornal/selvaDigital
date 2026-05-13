-- Ejecutar esto en el SQL Editor de Supabase si la tabla clients ya existe
-- y falta la columna project_name

-- Agregar columna project_name si no existe
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS project_name TEXT;

-- Verificar que la columna se agregó
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients';
