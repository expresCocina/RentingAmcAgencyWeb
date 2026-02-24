-- ============================================================
-- AMC Agency WaaS — Script completo de base de datos
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Proyecto nuevo: https://ngywfiecmrrlinckmfhx.supabase.co
-- ============================================================

-- ── 1. EXTENSIONES necesarias ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 2. TABLA: waas_clients ────────────────────────────────────────────────
-- Clientes del servicio WaaS (Website as a Service)
CREATE TABLE IF NOT EXISTS public.waas_clients (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID,                                        -- referencia al auth.users de Supabase
    business_name    TEXT NOT NULL,
    rep_name         TEXT NOT NULL,
    email            TEXT NOT NULL UNIQUE,
    whatsapp         TEXT,
    domain           TEXT NOT NULL,
    plan             TEXT NOT NULL DEFAULT 'renting_basico',      -- renting_basico | renting_pro | renting_elite
    is_blocked       BOOLEAN NOT NULL DEFAULT false,
    billing_day      INT NOT NULL DEFAULT 1,                      -- día del mes en que se cobra
    next_payment_date DATE,
    monthly_price    NUMERIC(10,2) NOT NULL DEFAULT 0,
    payment_status   TEXT NOT NULL DEFAULT 'pending'
                         CHECK (payment_status IN ('active', 'pending', 'overdue')),
    notes            TEXT,
    blocked_at       TIMESTAMPTZ,
    unblocked_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_waas_clients_user_id      ON public.waas_clients(user_id);
CREATE INDEX IF NOT EXISTS idx_waas_clients_domain        ON public.waas_clients(domain);
CREATE INDEX IF NOT EXISTS idx_waas_clients_payment       ON public.waas_clients(payment_status);
CREATE INDEX IF NOT EXISTS idx_waas_clients_next_payment  ON public.waas_clients(next_payment_date);

-- ── 3. TABLA: waas_leads ──────────────────────────────────────────────────
-- Prospectos que llegan desde los formularios del sitio web
CREATE TABLE IF NOT EXISTS public.waas_leads (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    email      TEXT,
    phone      TEXT,
    service    TEXT,                                              -- servicio de interés
    message    TEXT,
    source     TEXT NOT NULL DEFAULT 'website_form',             -- website_form | pricing_vip | renting_page
    status     TEXT NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waas_leads_status     ON public.waas_leads(status);
CREATE INDEX IF NOT EXISTS idx_waas_leads_created_at ON public.waas_leads(created_at);

-- ── 4. TABLA: waas_email_logs ─────────────────────────────────────────────
-- Registro de emails enviados a los clientes
CREATE TABLE IF NOT EXISTS public.waas_email_logs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id        UUID REFERENCES public.waas_clients(id) ON DELETE SET NULL,
    email_type       TEXT NOT NULL,   -- payment_reminder | blocked_notice | welcome | etc.
    recipient_email  TEXT NOT NULL,
    status           TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
    sent_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waas_email_logs_client ON public.waas_email_logs(client_id);

-- ── 5. ROW LEVEL SECURITY (RLS) ───────────────────────────────────────────
-- Las tablas admin se acceden solo desde el Service Role (backend)
-- Deshabilitamos RLS para que el service_role key tenga acceso total

ALTER TABLE public.waas_clients   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waas_leads     DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.waas_email_logs DISABLE ROW LEVEL SECURITY;

-- Si en el futuro quieres que los clientes vean SU propio registro,
-- habilita RLS y agrega esta política:
-- ALTER TABLE public.waas_clients ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Client sees own record"
--   ON public.waas_clients FOR SELECT
--   USING (auth.uid() = user_id);

-- ── 6. TRIGGER: actualizar updated_at automáticamente ────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_waas_clients_updated_at
    BEFORE UPDATE ON public.waas_clients
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 7. DATOS DE CONFIGURACIÓN INICIAL (opcional) ─────────────────────────
-- Descomenta si quieres un lead de prueba para verificar que funciona:
-- INSERT INTO public.waas_leads (name, email, service, message, source, status)
-- VALUES ('Lead de Prueba', 'test@amcagencyweb.com', 'renting_web', 'Test setup', 'website_form', 'new');

-- ── VERIFICACIÓN ──────────────────────────────────────────────────────────
-- Después de ejecutar, corre esto para confirmar que todo creó bien:
SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS columns
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('waas_clients', 'waas_leads', 'waas_email_logs')
ORDER BY table_name;
