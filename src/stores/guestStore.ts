import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { WordList, Word, TestResult } from '../types';
import {
  saveGuestWordList,
  getAllGuestWordLists,
  deleteGuestWordList,
  saveGuestWord,
  saveGuestTestResult,
  clearGuestData
} from '../lib/guestStorage';

interface GuestState {
  userId: string;
  lists: WordList[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  initialize: () => Promise<void>;
  addList: (list: Partial<WordList>) => Promise<WordList>;
  updateList: (id: string, updates: Partial<WordList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  addWords: (listId: string, words: Word[]) => Promise<void>;
  saveTestResult: (result: Omit<TestResult, 'id'>) => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useGuestStore = create<GuestState>((set, get) => ({
  userId: `guest-${uuidv4()}`,
  lists: [],
  loading: false,
  error: null,
  initialized: false,

  initialize: async () => {
    try {
      set({ loading: true });
      const lists = await getAllGuestWordLists(get().userId);
      set({ lists, initialized: true });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to initialize guest data' });
    } finally {
      set({ loading: false });
    }
  },

  addList: async (list) => {
    const newList: WordList = {
      id: `guest-list-${uuidv4()}`,
      title: list.title || 'Untitled List',
      description: list.description || '',
      fromLanguage: list.fromLanguage || { code: 'en', name: 'English' },
      toLanguage: list.toLanguage || { code: 'fr', name: 'French' },
      words: list.words || [],
      userId: get().userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await saveGuestWordList(newList);
      set(state => ({
        lists: [newList, ...state.lists]
      }));
      return newList;
    } catch (error) {
      throw new Error('Failed to create list');
    }
  },

  updateList: async (id, updates) => {
    const list = get().lists.find(l => l.id === id);
    if (!list) throw new Error('List not found');

    const updatedList = {
      ...list,
      ...updates,
      updatedAt: new Date()
    };

    try {
      await saveGuestWordList(updatedList);
      set(state => ({
        lists: state.lists.map(l => l.id === id ? updatedList : l)
      }));
    } catch (error) {
      throw new Error('Failed to update list');
    }
  },

  deleteList: async (id) => {
    try {
      await deleteGuestWordList(id);
      set(state => ({
        lists: state.lists.filter(l => l.id !== id)
      }));
    } catch (error) {
      throw new Error('Failed to delete list');
    }
  },

  addWords: async (listId, words) => {
    const list = get().lists.find(l => l.id === listId);
    if (!list) throw new Error('List not found');

    const wordPromises = words.map(async word => {
      const wordWithId = {
        ...word,
        id: `guest-word-${uuidv4()}`
      };
      await saveGuestWord(wordWithId);
      return wordWithId;
    });

    try {
      const savedWords = await Promise.all(wordPromises);
      const updatedList = {
        ...list,
        words: [...list.words, ...savedWords.map(w => w.id)],
        updatedAt: new Date()
      };

      await saveGuestWordList(updatedList);
      set(state => ({
        lists: state.lists.map(l => l.id === listId ? updatedList : l)
      }));
    } catch (error) {
      throw new Error('Failed to add words');
    }
  },

  saveTestResult: async (result) => {
    const testResult: TestResult = {
      ...result,
      id: `guest-result-${uuidv4()}`
    };

    try {
      await saveGuestTestResult(testResult);
    } catch (error) {
      throw new Error('Failed to save test result');
    }
  },

  clearAll: async () => {
    try {
      await clearGuestData();
      set({ lists: [], userId: `guest-${uuidv4()}` });
    } catch (error) {
      throw new Error('Failed to clear guest data');
    }
  }
}));