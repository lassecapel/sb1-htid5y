import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppConfig } from '../types/config';
import { DEFAULT_CONFIG } from '../types/config';

interface ConfigState {
  config: AppConfig;
  defaultLanguage: string;
  colorScheme: string;
  updateAccountSettings: (settings: Partial<AppConfig['account']>) => void;
  updateVisualPreferences: (preferences: Partial<AppConfig['visual']>) => void;
  updateTestSettings: (settings: Partial<AppConfig['test']>) => void;
  updatePracticeConfig: (config: Partial<AppConfig['practice']>) => void;
  setDefaultLanguage: (language: string) => void;
  setColorScheme: (scheme: string) => void;
  resetConfig: () => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      defaultLanguage: 'en',
      colorScheme: 'default',
      
      updateAccountSettings: (settings) =>
        set((state) => ({
          config: {
            ...state.config,
            account: { ...state.config.account, ...settings }
          }
        })),
      
      updateVisualPreferences: (preferences) =>
        set((state) => ({
          config: {
            ...state.config,
            visual: { ...state.config.visual, ...preferences }
          }
        })),
      
      updateTestSettings: (settings) =>
        set((state) => ({
          config: {
            ...state.config,
            test: { ...state.config.test, ...settings }
          }
        })),
      
      updatePracticeConfig: (config) =>
        set((state) => ({
          config: {
            ...state.config,
            practice: { ...state.config.practice, ...config }
          }
        })),

      setDefaultLanguage: (language) =>
        set(() => ({
          defaultLanguage: language
        })),

      setColorScheme: (scheme) =>
        set(() => ({
          colorScheme: scheme
        })),
      
      resetConfig: () => set({ config: DEFAULT_CONFIG }),
    }),
    {
      name: 'app-config-storage',
    }
  )
);