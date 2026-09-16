-- Stoneage Properties: Supabase schema
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE throughout.

create extension if not exists "pgcrypto";

-- ============================================================
-- Contact form submissions (Spatial Brief Intake)
-- ============================================================
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  project_types text[] not null default '{}',
  location text,
  timeline text,
  message text,
  source text not null default 'spatial-brief-form',
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  user_agent text,
  referrer text,
  -- Legacy combined consent flag (kept for historical rows) — superseded
  -- by the per-channel preference columns below.
  contact_consent boolean not null default false,
  contact_consent_at timestamptz,
  -- Per-channel communication preferences, set at submission time and
  -- updatable later (e.g. via an unsubscribe link or a "STOP" reply).
  email_opt_in boolean not null default false,
  email_opted_out boolean not null default false,
  email_opted_out_at timestamptz,
  whatsapp_opt_in boolean not null default false,
  whatsapp_opted_out boolean not null default false,
  whatsapp_opted_out_at timestamptz,
  preferences_updated_at timestamptz,
  client_email_sent_at timestamptz,
  admin_email_sent_at timestamptz,
  client_whatsapp_sent_at timestamptz,
  admin_whatsapp_sent_at timestamptz
);

-- Migration: add columns to a table created before this feature existed.
alter table public.contact_submissions add column if not exists phone text;
alter table public.contact_submissions add column if not exists contact_consent boolean not null default false;
alter table public.contact_submissions add column if not exists contact_consent_at timestamptz;
alter table public.contact_submissions add column if not exists email_opt_in boolean not null default false;
alter table public.contact_submissions add column if not exists email_opted_out boolean not null default false;
alter table public.contact_submissions add column if not exists email_opted_out_at timestamptz;
alter table public.contact_submissions add column if not exists whatsapp_opt_in boolean not null default false;
alter table public.contact_submissions add column if not exists whatsapp_opted_out boolean not null default false;
alter table public.contact_submissions add column if not exists whatsapp_opted_out_at timestamptz;
alter table public.contact_submissions add column if not exists preferences_updated_at timestamptz;
alter table public.contact_submissions add column if not exists client_email_sent_at timestamptz;
alter table public.contact_submissions add column if not exists admin_email_sent_at timestamptz;
alter table public.contact_submissions add column if not exists client_whatsapp_sent_at timestamptz;
alter table public.contact_submissions add column if not exists admin_whatsapp_sent_at timestamptz;

-- Migration: rename the earlier whatsapp-only consent column if it exists
-- from a prior run of this script (harmless no-op on a fresh database).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'contact_submissions' and column_name = 'whatsapp_consent'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'contact_submissions' and column_name = 'contact_consent'
  ) then
    alter table public.contact_submissions rename column whatsapp_consent to contact_consent;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'contact_submissions' and column_name = 'whatsapp_consent_at'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'contact_submissions' and column_name = 'contact_consent_at'
  ) then
    alter table public.contact_submissions rename column whatsapp_consent_at to contact_consent_at;
  end if;
end $$;

-- Migration: backfill the new per-channel opt-in columns from the legacy
-- combined consent flag, for any rows submitted before this change.
-- Never overwrites a row that already has an explicit preference set.
update public.contact_submissions
  set email_opt_in = true
  where contact_consent = true and email_opt_in = false;

update public.contact_submissions
  set whatsapp_opt_in = true
  where contact_consent = true and phone is not null and whatsapp_opt_in = false;

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

-- Only the server (service role key) may read/write. No public/anon access.
drop policy if exists "service role full access" on public.contact_submissions;
create policy "service role full access"
  on public.contact_submissions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================
-- AI chat: conversations + messages (marketing chat widget history)
-- ============================================================
create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  visitor_id text not null,        -- anonymous client-generated id (localStorage)
  page_path text,
  referrer text,
  user_agent text,
  contact_email text,              -- filled in if the visitor identifies themselves mid-chat
  contact_name text,
  lead_captured boolean not null default false
);

create index if not exists chat_conversations_visitor_id_idx
  on public.chat_conversations (visitor_id);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  conversation_id uuid not null references public.chat_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null
);

create index if not exists chat_messages_conversation_id_idx
  on public.chat_messages (conversation_id, created_at);

alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "service role full access" on public.chat_conversations;
create policy "service role full access"
  on public.chat_conversations
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "service role full access" on public.chat_messages;
create policy "service role full access"
  on public.chat_messages
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Keep updated_at current on chat_conversations
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists chat_conversations_set_updated_at on public.chat_conversations;
create trigger chat_conversations_set_updated_at
  before update on public.chat_conversations
  for each row
  execute function public.set_updated_at();
