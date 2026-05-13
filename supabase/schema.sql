-- Ejecutar esto en el SQL Editor de Supabase

-- Tabla de clientes/proyectos
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  project_name TEXT,
  project_type TEXT NOT NULL DEFAULT 'web',
  status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'propuesta', 'seña', 'diseño', 'desarrollo', 'demo', 'deploy', 'finalizado', 'pausado')),
  total_amount NUMERIC(12,2),
  deposit_amount NUMERIC(12,2),
  design_amount NUMERIC(12,2),
  final_amount NUMERIC(12,2),
  weeks INTEGER,
  current_phase INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de fases del proyecto
CREATE TABLE IF NOT EXISTS project_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  phase_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_progreso', 'completado', 'enviado')),
  sent_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mensajes enviados
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador', 'enviado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política: solo usuarios autenticados pueden leer/escribir
CREATE POLICY "Allow authenticated read clients" ON clients
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert clients" ON clients
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update clients" ON clients
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete clients" ON clients
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read phases" ON project_phases
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert phases" ON project_phases
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update phases" ON project_phases
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete phases" ON project_phases
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read messages" ON messages
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert messages" ON messages
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update messages" ON messages
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete messages" ON messages
  FOR DELETE TO authenticated USING (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_phases_updated_at BEFORE UPDATE ON project_phases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
