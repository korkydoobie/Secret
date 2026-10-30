create table if not exists public.date_responses (
  id uuid primary key default gen_random_uuid(),
  answer text not null check (answer = 'yes'),
  received_at timestamptz not null default now()
);

alter table public.date_responses enable row level security;

revoke all on table public.date_responses from anon, authenticated;
grant insert on table public.date_responses to anon;

drop policy if exists "Public may submit yes" on public.date_responses;
create policy "Public may submit yes"
on public.date_responses
for insert
to anon
with check (answer = 'yes');

-- Visitors deliberately receive no SELECT, UPDATE, or DELETE access.
-- View responses in the Supabase dashboard's Table Editor.
