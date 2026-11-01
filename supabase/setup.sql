create table if not exists public.date_responses (
  id uuid primary key default gen_random_uuid(),
  answer text not null check (answer = 'yes'),
  outing_date date,
  received_at timestamptz not null default now()
);

-- Safe to rerun for existing projects; older answers keep a NULL date.
alter table public.date_responses add column if not exists outing_date date;

alter table public.date_responses enable row level security;

revoke all on table public.date_responses from anon, authenticated;
grant insert on table public.date_responses to anon;

drop policy if exists "Public may submit yes" on public.date_responses;
create policy "Public may submit yes"
on public.date_responses
for insert
to anon
with check (answer = 'yes' and outing_date is not null and outing_date >= (now() at time zone 'Asia/Singapore')::date);

-- Visitors deliberately receive no SELECT, UPDATE, or DELETE access.
-- View responses in the Supabase dashboard's Table Editor.
