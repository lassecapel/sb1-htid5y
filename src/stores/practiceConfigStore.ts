import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PracticeConfig } from '../types/practiceConfig';
import { DEFAULT_PRACTICE_CONFIG } from '../types/practiceConfig';

interface PracticeConfigState {
  config: PracticeConfig;
  updateConfig: (config: Partial<PracticeConfig>) => void;
  resetConfig: () => void;
}

export const usePracticeConfigStore = create<PracticeConfigState>()(
  persist(
    (set) => ({
      config: DEFAULT_PRACTICE_CONFIG,
      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      resetConfig: () => set({ config: DEFAULT_PRACTICE_CONFIG }),
    }),
    {
      name: 'practice-config-storage',
    }
  )
);