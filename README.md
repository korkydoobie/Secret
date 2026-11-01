# Joana's black-cat date invitation — Next.js

## Run locally

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>. Changes made in `app/` reload automatically.

On Windows PowerShell, use `pnpm.cmd install` and `pnpm.cmd dev` if script execution is disabled.

## Configure Supabase

1. Open the Supabase project’s SQL Editor.
2. Run `supabase/setup.sql`. Rerun it for existing projects to add the outing date column and update the insert policy.
3. Put the project URL and publishable key in `.env.local`.

Clicking **Yes** opens a date picker. **Save our date** inserts the answer and chosen date (`outing_date`) together into `date_responses`. Past dates are rejected using Singapore time. View results in Supabase’s Table Editor. Public visitors can insert responses but cannot read, edit, or delete them. Older responses keep an empty outing date.

## GitHub Pages

The project exports a static site into `out/`. After creating a GitHub repository, set `NEXT_PUBLIC_BASE_PATH` to `/<repository-name>` when building a project Pages site.
