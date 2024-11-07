-- Add subscription related tables
create type subscription_tier as enum ('free', 'premium', 'pro');

create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  tier subscription_tier not null default 'free',
  status text not null default 'active',
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at_period_end boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

create table public.subscription_features (
  id uuid default uuid_generate_v4() primary key,
  tier subscription_tier not null,
  feature text not null,
  limit integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tier, feature)
);

create table public.generated_sentences (
  id uuid default uuid_generate_v4() primary key,
  word_id uuid references public.words not null,
  sentence text not null,
  language_code text references public.languages not null,
  source text not null default 'openai',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(word_id, language_code, sentence)
);

create table public.api_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  endpoint text not null,
  count integer not null default 0,
  reset_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, endpoint, reset_at)
);

-- Add RLS policies
alter table public.subscriptions enable row level security;
alter table public.subscription_features enable row level security;
alter table public.generated_sentences enable row level security;
alter table public.api_usage enable row level security;

create policy "Users can read their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Public access to subscription features"
  on public.subscription_features for select
  using (true);

create policy "Public access to generated sentences"
  on public.generated_sentences for select
  using (true);

create policy "Users can read their own API usage"
  on public.api_usage for select
  using (auth.uid() = user_id);

-- Insert subscription features
insert into public.subscription_features (tier, feature, limit) values
  ('free', 'word_lists', 10),
  ('free', 'practice_modes', 1),
  ('free', 'api_calls_per_day', 100),
  ('premium', 'word_lists', null),
  ('premium', 'practice_modes', 3),
  ('premium', 'api_calls_per_day', 1000),
  ('pro', 'word_lists', null),
  ('pro', 'practice_modes', null),
  ('pro', 'api_calls_per_day', 5000);

-- Add function to check subscription limits
create or replace function check_subscription_limit(
  user_id uuid,
  feature text,
  current_count integer default 0
) returns boolean as $$
declare
  user_tier subscription_tier;
  feature_limit integer;
begin
  -- Get user's subscription tier
  select tier into user_tier
  from subscriptions
  where subscriptions.user_id = check_subscription_limit.user_id
  and status = 'active'
  and current_period_end > now();

  -- Default to free tier if no active subscription
  if user_tier is null then
    user_tier := 'free';
  end if;

  -- Get feature limit for user's tier
  select limit into feature_limit
  from subscription_features
  where tier = user_tier
  and subscription_features.feature = check_subscription_limit.feature;

  -- If limit is null, feature is unlimited
  if feature_limit is null then
    return true;
  end if;

  -- Check if current count exceeds limit
  return current_count < feature_limit;
end;
$$ language plpgsql security definer;