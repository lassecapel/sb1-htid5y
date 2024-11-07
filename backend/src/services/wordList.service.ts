import { supabase } from '../lib/supabase';
import { ApiError } from '../utils/ApiError';
import type { WordList } from '../types';

export class WordListService {
  async getWordLists(userId: string): Promise<WordList[]> {
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new ApiError(error.message, 500);
    return data;
  }

  async createWordList(data: Partial<WordList>): Promise<WordList> {
    const { data: list, error } = await supabase
      .from('word_lists')
      .insert([data])
      .select()
      .single();

    if (error) throw new ApiError(error.message, 500);
    return list;
  }

  async updateWordList(
    id: string, 
    data: Partial<WordList>, 
    userId: string
  ): Promise<WordList> {
    // First check if the list exists and belongs to the user
    const { data: existingList, error: fetchError } = await supabase
      .from('word_lists')
      .select()
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw new ApiError('Word list not found', 404);
    if (!existingList) throw new ApiError('Unauthorized', 403);

    // Update the list
    const { data: updatedList, error: updateError } = await supabase
      .from('word_lists')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw new ApiError(updateError.message, 500);
    return updatedList;
  }

  async deleteWordList(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('word_lists')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new ApiError(error.message, 500);
  }

  async forkWordList(id: string, userId: string): Promise<WordList> {
    // Get the original list
    const { data: originalList, error: fetchError } = await supabase
      .from('word_lists')
      .select(`
        *,
        words:word_list_entries(
          word_id,
          position
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) throw new ApiError('Word list not found', 404);

    // Start a transaction using RPC
    const { data: forkedList, error: forkError } = await supabase.rpc('fork_word_list', {
      original_list_id: id,
      new_user_id: userId,
      new_title: `${originalList.title} (Fork)`,
      new_description: `Forked from ${originalList.title}`
    });

    if (forkError) throw new ApiError(forkError.message, 500);
    return forkedList;
  }
}