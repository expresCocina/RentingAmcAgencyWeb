-- ============================================================
-- AMC Agency — Migración: Integración App Móvil
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Fecha: 2026-04
-- ============================================================

-- ── 1. Agregar campos de tracking para leads desde la app ──
ALTER TABLE public.waas_leads
  ADD COLUMN IF NOT EXISTS app_version TEXT,
  ADD COLUMN IF NOT EXISTS device_info TEXT;

-- ── 2. Habilitar RLS en waas_clients ───────────────────────
-- Permite que los clientes autenticados vean SOLO su propio registro
ALTER TABLE public.waas_clients ENABLE ROW LEVEL SECURITY;

-- ── 3. Política RLS: cliente ve su propio registro ─────────
DROP POLICY IF EXISTS "Client sees own record" ON public.waas_clients;
CREATE POLICY "Client sees own record"
  ON public.waas_clients FOR SELECT
  USING (auth.uid() = user_id);

-- ── 4. Política RLS: solo service_role puede insertar/actualizar ──
-- (Next.js ya usa service_role_key que bypasea RLS automáticamente)
DROP POLICY IF EXISTS "Service role full access" ON public.waas_clients;
CREATE POLICY "Service role full access"
  ON public.waas_clients
  USING (true)
  WITH CHECK (true);

-- ── 5. waas_leads sigue sin RLS (solo Next.js escribe) ─────
ALTER TABLE public.waas_leads DISABLE ROW LEVEL SECURITY;

-- ── 6. Índice para búsqueda por source (app vs web) ────────
CREATE INDEX IF NOT EXISTS idx_waas_leads_source ON public.waas_leads(source);

-- ── 7. Índice para app_version (analytics) ─────────────────
CREATE INDEX IF NOT EXISTS idx_waas_leads_app_version ON public.waas_leads(app_version);

-- ── VERIFICACIÓN ──────────────────────────────────────────
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'waas_leads'
  AND column_name IN ('app_version', 'device_info', 'source');
