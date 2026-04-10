-- Run this SQL in Supabase SQL Editor before using the APIs.

create extension if not exists pgcrypto;

create table if not exists public.online_tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  total_candidates integer not null,
  total_slots integer not null,
  total_question_set integer not null,
  question_type text not null check (question_type in ('MCQ', 'Checkbox', 'Text')),
  start_time text not null,
  end_time text not null,
  duration_minutes integer not null,
  negative_marking text not null default '-0.25/wrong',
  created_by uuid not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.online_test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.online_tests(id) on delete cascade,
  prompt_html text not null,
  question_type text not null check (question_type in ('Radio', 'Checkbox', 'Text')),
  score integer not null default 1,
  position integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.online_test_question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.online_test_questions(id) on delete cascade,
  option_text_html text not null,
  is_correct boolean not null default false,
  position integer not null
);

create table if not exists public.online_test_attempts (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.online_tests(id) on delete cascade,
  candidate_id uuid not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'timed_out')),
  obtained_score numeric not null default 0
);

create table if not exists public.online_test_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.online_test_attempts(id) on delete cascade,
  question_id uuid not null references public.online_test_questions(id) on delete cascade,
  answer_payload jsonb not null,
  awarded_score numeric not null default 0,
  created_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create index if not exists idx_online_tests_created_by on public.online_tests(created_by);
create index if not exists idx_online_test_questions_test_id on public.online_test_questions(test_id);
create index if not exists idx_online_test_options_question_id on public.online_test_question_options(question_id);
create index if not exists idx_online_test_attempts_test_candidate on public.online_test_attempts(test_id, candidate_id);
