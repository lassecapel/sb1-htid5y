import OpenAI from 'openai';
import { supabase } from '../lib/supabase';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateSentence(
  word: string,
  languageCode: string,
  userId: string
): Promise<string> {
  // First check API usage limits
  const { data: usage, error: usageError } = await supabase
    .from('api_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('endpoint', 'sentence_generation')
    .gte('reset_at', new Date().toISOString())
    .single();

  if (usageError) {
    console.error('Failed to check API usage:', usageError);
    throw new Error('Failed to check API usage limits');
  }

  // Check cached sentences first
  const { data: cached, error: cacheError } = await supabase
    .from('generated_sentences')
    .select('sentence')
    .eq('word_id', word)
    .eq('language_code', languageCode)
    .limit(1)
    .single();

  if (!cacheError && cached) {
    return cached.sentence;
  }

  // Generate new sentence using OpenAI
  try {
    const prompt = `Generate a simple, natural sentence in ${languageCode} using the word "${word}". The sentence should be suitable for language learning.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
      temperature: 0.7,
    });

    const sentence = response.choices[0].message.content?.trim() || '';

    // Cache the generated sentence
    await supabase.from('generated_sentences').insert([{
      word_id: word,
      sentence,
      language_code: languageCode,
      source: 'openai'
    }]);

    // Update API usage
    await supabase.from('api_usage').upsert([{
      user_id: userId,
      endpoint: 'sentence_generation',
      count: (usage?.count || 0) + 1,
      reset_at: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
    }]);

    return sentence;
  } catch (error) {
    console.error('Failed to generate sentence:', error);
    throw new Error('Failed to generate sentence');
  }
}