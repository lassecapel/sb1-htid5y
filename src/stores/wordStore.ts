import { create } from 'zustand';
import { api } from '../lib/api';
import type { Word, Translation } from '../types';

interface WordState {
  words: Record<string, Word>;
  loading: boolean;
  error: string | null;
  findOrCreateWord: (category: string, translations: Translation[]) => Promise<Word>;
  getWordWithTranslations: (id: string) => Promise<Word>;
  addWords: (words: Word[]) => void;
}

export const useWordStore = create<WordState>((set, get) => ({
  words: {},
  loading: false,
  error: null,

  findOrCreateWord: async (category, translations) => {
    set({ loading: true, error: null });
    try {
      const word = await api.findOrCreateWord(category, translations);
      set(state => ({
        words: { ...state.words, [word.id]: word }
      }));
      return word;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create word';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  getWordWithTranslations: async (id) => {
    // Check cache first
    if (get().words[id]) {
      return get().words[id];
    }

    set({ loading: true, error: null });
    try {
      const word = await api.getWordWithTranslations(id);
      set(state => ({
        words: { ...state.words, [word.id]: word }
      }));
      return word;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch word';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  addWords: (words) => {
    const wordMap = words.reduce((acc, word) => ({
      ...acc,
      [word.id]: word
    }), {});
    set(state => ({
      words: { ...state.words, ...wordMap }
    }));
  }
}));