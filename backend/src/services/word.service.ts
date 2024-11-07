import { supabase } from '../lib/supabase';
import { ApiError } from '../utils/ApiError';
import type { Word, Translation } from '../types';

export class WordService {
  async findOrCreateWord(
    category: string,
    translations: Translation[]
  ): Promise<Word> {
    // Try to find existing word with the same translations
    const primaryTranslation = translations[0];
    const { data: existingWord, error: searchError } = await supabase
      .from('words')
      .select(`
        *,
        translations(*)
      `)
      .eq('translations.value', primaryTranslation.value)
      .eq('translations.language_code', primaryTranslation.languageCode)
      .single();

    if (!searchError && existingWord) {
      return existingWord;
    }

    // Create new word if not found
    const { data: word, error: createError } = await supabase
      .from('words')
      .insert([{ category, complexity: 1 }])
      .select()
      .single();

    if (createError) throw new ApiError(createError.message, 500);

    // Add translations
    const { error: translationError } = await supabase
      .from('translations')
      .insert(
        translations.map(t => ({
          word_id: word.id,
          language_code: t.languageCode,
          value: t.value,
          pronunciation: t.pronunciation
        }))
      );

    if (translationError) throw new ApiError(translationError.message, 500);

    // Return complete word with translations
    const { data: completeWord, error: fetchError } = await supabase
      .from('words')
      .select(`
        *,
        translations(*)
      `)
      .eq('id', word.id)
      .single();

    if (fetchError) throw new ApiError(fetchError.message, 500);
    return completeWord;
  }

  async getWordWithTranslations(wordId: string): Promise<Word> {
    const { data, error } = await supabase
      .from('words')
      .select(`
        *,
        translations(*)
      `)
      .eq('id', wordId)
      .single();

    if (error) throw new ApiError(error.message, 500);
    if (!data) throw new ApiError('Word not found', 404);
    return data;
  }
}