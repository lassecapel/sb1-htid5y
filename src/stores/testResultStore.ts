import { create } from 'zustand';
import { api } from '../lib/api';
import type { TestResult } from '../types';

interface TestResultState {
  results: TestResult[];
  currentTest: Partial<TestResult> | null;
  loading: boolean;
  error: string | null;
  saveTestResult: (result: Omit<TestResult, 'id'>) => Promise<void>;
  getTestResults: (wordListId?: string) => Promise<void>;
  startTest: (wordListId: string, type: TestResult['type']) => void;
  updateCurrentTest: (updates: Partial<TestResult>) => void;
  clearCurrentTest: () => void;
}

export const useTestResultStore = create<TestResultState>((set) => ({
  results: [],
  currentTest: null,
  loading: false,
  error: null,

  saveTestResult: async (result) => {
    set({ loading: true, error: null });
    try {
      const savedResult = await api.saveTestResult(result);
      set(state => ({
        results: [savedResult, ...state.results],
        currentTest: null
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save test result';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  getTestResults: async (wordListId) => {
    set({ loading: true, error: null });
    try {
      const results = await api.getTestResults(wordListId);
      set({ results });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch test results';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  startTest: (wordListId, type) => {
    set({
      currentTest: {
        wordListId,
        type,
        startedAt: new Date(),
        answers: [],
        state: {
          wordOrder: [],
          currentIndex: 0,
          remainingWords: [],
          mistakeWords: []
        }
      }
    });
  },

  updateCurrentTest: (updates) => {
    set(state => ({
      currentTest: state.currentTest ? { ...state.currentTest, ...updates } : null
    }));
  },

  clearCurrentTest: () => {
    set({ currentTest: null });
  }
}));