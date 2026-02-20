-- =====================================================
-- AMC Agency WaaS — Supabase Schema
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =====================================================

-- 1. TABLA PRINCIPAL DE CLIENTES WAAS
create table if not exists waas_clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  business_name text not null,
  rep_name text not null,
  email text not null unique,
  whatsapp text,
  domain text not null unique,        -- ej: "www.turbobrandcol.com"
  plan text not null default 'renting_basico',
  is_blocked boolean not null default false,
  billing_day integer not null default 1,     -- día del mes (1-28)
  next_payment_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  blocked_at timestamptz,
  unblocked_at timestamptz
);

-- 2. TABLA DE LOGS DE EMAILS ENVIADOS
create table if not exists waas_email_logs (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references waas_clients(id) on delete cascade,
  email_type text not null,   -- 'welcome' | 'payment_reminder' | 'blocked' | 'unblocked'
  recipient_email text not null,
  sent_at timestamptz default now(),
  status text not null default 'sent',  -- 'sent' | 'failed'
  error_message text
);

-- 3. TABLA DE CONFIGURACIÓN DE INTEGRACIONES META
create table if not exists meta_integrations (
  id uuid default gen_random_uuid() primary key,
  channel text not null unique,   -- 'whatsapp' | 'instagram' | 'messenger'
  is_active boolean default false,
  phone_number_id text,           -- WhatsApp
  waba_id text,                   -- WhatsApp Business Account ID
  access_token text,              -- Meta User/Page Access Token
  page_id text,                   -- Facebook Page ID (Messenger/IG)
  instagram_account_id text,      -- Instagram Business Account ID
  webhook_verify_token text,      -- Para verificar el webhook de Meta
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Insertar filas base de integraciones
insert into meta_integrations (channel) values ('whatsapp'), ('instagram'), ('messenger')
  on conflict (channel) do nothing;

-- 4. TABLA DE MENSAJES ENTRANTES (conversaciones Meta)
create table if not exists meta_messages (
  id uuid default gen_random_uuid() primary key,
  channel text not null,        -- 'whatsapp' | 'instagram' | 'messenger'
  sender_id text not null,      -- ID del remitente en Meta
  sender_name text,
  message_text text,
  message_type text default 'text',  -- 'text' | 'image' | 'audio' | 'video'
  media_url text,
  is_read boolean default false,
  received_at timestamptz default now()
);

-- 5. ROW LEVEL SECURITY
alter table waas_clients enable row level security;
alter table waas_email_logs enable row level security;
alter table meta_integrations enable row level security;
alter table meta_messages enable row level security;

-- Clientes: solo ven su propio registro (user_id = auth.uid())
create policy "client_own_row" on waas_clients
  for select using (auth.uid() = user_id);

-- Email logs: los clientes ven sus propios logs
create policy "client_own_email_logs" on waas_email_logs
  for select using (
    client_id in (select id from waas_clients where user_id = auth.uid())
  );

-- Las demás tablas (meta_integrations, meta_messages) solo admin via service_role
-- No crear policies para ellas → el service_role las bypasa de todos modos

-- 6. FUNCIÓN AUTO-UPDATE "updated_at"
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger waas_clients_updated_at
  before update on waas_clients
  for each row execute function update_updated_at();

create trigger meta_integrations_updated_at
  before update on meta_integrations
  for each row execute function update_updated_at();

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================
