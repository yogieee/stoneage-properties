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
  project_types text[] not null default '{}',
  location text,
  timeline text,
  message text,
  source text not null default 'spatial-brief-form',
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  user_agent text,
  referrer text
);

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
