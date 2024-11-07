create or replace function fork_word_list(
  original_list_id uuid,
  new_user_id uuid,
  new_title text,
  new_description text
) returns word_lists as $$
declare
  forked_list word_lists;
begin
  -- Create the forked list
  insert into word_lists (
    title,
    description,
    from_language,
    to_language,
    user_id
  )
  select
    new_title,
    new_description,
    from_language,
    to_language,
    new_user_id
  from word_lists
  where id = original_list_id
  returning * into forked_list;

  -- Copy word list entries
  insert into word_list_entries (
    word_list_id,
    word_id,
    position
  )
  select
    forked_list.id,
    word_id,
    position
  from word_list_entries
  where word_list_id = original_list_id;

  -- Increment fork count of original list
  update word_lists
  set fork_count = fork_count + 1
  where id = original_list_id;

  return forked_list;
end;
$$ language plpgsql security definer;