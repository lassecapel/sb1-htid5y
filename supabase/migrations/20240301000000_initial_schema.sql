-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type practice_type as enum ('flashcards', 'writing', 'quiz', 'listening');

-- Create tables
create table public.languages (
  code text primary key,
  name text not null
);

create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.words (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  complexity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.translations (
  id uuid default uuid_generate_v4() primary key,
  word_id uuid references public.words on delete cascade not null,
  language_code text references public.languages not null,
  value text not null,
  pronunciation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(word_id, language_code, value)
);

create table public.word_lists (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  from_language text references public.languages not null,
  to_language text references public.languages not null,
  user_id uuid references public.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.word_list_entries (
  word_list_id uuid references public.word_lists on delete cascade not null,
  word_id uuid references public.words on delete cascade not null,
  position integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (word_list_id, word_id)
);

create table public.test_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  word_list_id uuid references public.word_lists on delete cascade not null,
  type practice_type not null,
  started_at timestamp with time zone not null,
  completed_at timestamp with time zone not null,
  total_time integer not null,
  correct_count integer not null,
  total_count integer not null,
  score decimal(5,2) not null,
  state jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.test_answers (
  id uuid default uuid_generate_v4() primary key,
  test_result_id uuid references public.test_results on delete cascade not null,
  word_id uuid references public.words on delete cascade not null,
  given_answer text not null,
  correct_answer text not null,
  is_correct boolean not null,
  match_score integer not null,
  time_spent integer not null,
  attempts integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_translations_word_id on public.translations(word_id);
create index idx_translations_language on public.translations(language_code);
create index idx_word_list_entries_word_id on public.word_list_entries(word_id);
create index idx_test_results_user on public.test_results(user_id);
create index idx_test_results_word_list on public.test_results(word_list_id);
create index idx_test_answers_test_result on public.test_answers(test_result_id);
create index idx_test_answers_word on public.test_answers(word_id);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.words enable row level security;
alter table public.translations enable row level security;
alter table public.word_lists enable row level security;
alter table public.word_list_entries enable row level security;
alter table public.test_results enable row level security;
alter table public.test_answers enable row level security;

-- Create policies
create policy "Users can read their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Public words are readable by all"
  on public.words for select
  using (true);

create policy "Public translations are readable by all"
  on public.translations for select
  using (true);

create policy "Users can read all word lists"
  on public.word_lists for select
  using (true);

create policy "Users can create their own word lists"
  on public.word_lists for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own word lists"
  on public.word_lists for update
  using (auth.uid() = user_id);

create policy "Users can delete their own word lists"
  on public.word_lists for delete
  using (auth.uid() = user_id);

create policy "Users can read all word list entries"
  on public.word_list_entries for select
  using (true);

create policy "Users can manage their own test results"
  on public.test_results for all
  using (auth.uid() = user_id);

create policy "Users can manage their own test answers"
  on public.test_answers for all
  using (exists (
    select 1 from public.test_results
    where test_results.id = test_result_id
    and test_results.user_id = auth.uid()
  ));