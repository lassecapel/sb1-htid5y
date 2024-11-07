import { supabase } from '../lib/supabase';
import type { WordList } from '../types';

export async function getWordLists() {
  const { data, error } = await supabase
    .from('word_lists')
    .select(`
      *,
      words:word_list_entries(
        word:words(
          *,
          translations(*)
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as WordList[];
}

export async function createWordList(list: Partial<WordList>) {
  const { data, error } = await supabase
    .from('word_lists')
    .insert([list])
    .select()
    .single();

  if (error) throw error;
  return data as WordList;
}

export async function updateWordList(id: string, updates: Partial<WordList>) {
  const { data, error } = await supabase
    .from('word_lists')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as WordList;
}

export async function deleteWordList(id: string) {
  const { error } = await supabase
    .from('word_lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function forkWordList(id: string) {
  // First get the original list
  const { data: originalList, error: fetchError } = await supabase
    .from('word_lists')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  // Create the forked list
  const { data: forkedList, error: insertError } = await supabase
    .from('word_lists')
    .insert([{
      ...originalList,
      id: undefined,
      title: `${originalList.title} (Fork)`,
      description: `Forked from ${originalList.title}`,
      user_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
      fork_count: 0,
    }])
    .select()
    .single();

  if (insertError) throw insertError;

  // Increment the fork count of the original list
  const { error: incrementError } = await supabase
    .rpc('increment_fork_count', { list_id: id });

  if (incrementError) throw incrementError;

  return forkedList as WordList;
}