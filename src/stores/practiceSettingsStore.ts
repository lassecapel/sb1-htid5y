import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PracticeSettings, DEFAULT_PRACTICE_SETTINGS, PracticeSettingsSchema } from '../types/practiceSettings';

interface PracticeSettingsState {
  settings: PracticeSettings;
  updateSettings: (newSettings: Partial<PracticeSettings>) => void;
  updateModeSettings: <T extends keyof PracticeSettings>(
    mode: T,
    settings: Partial<PracticeSettings[T]>
  ) => void;
  resetSettings: () => void;
  validateSettings: () => boolean;
}

export const usePracticeSettingsStore = create<PracticeSettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_PRACTICE_SETTINGS,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings
          }
        }));
      },

      updateModeSettings: (mode, settings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [mode]: {
              ...state.settings[mode],
              ...settings
            }
          }
        }));
      },

      resetSettings: () => {
        set({ settings: DEFAULT_PRACTICE_SETTINGS });
      },

      validateSettings: () => {
        try {
          PracticeSettingsSchema.parse(get().settings);
          return true;
        } catch (error) {
          console.error('Invalid practice settings:', error);
          return false;
        }
      }
    }),
    {
      name: 'practice-settings-storage',
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          return {
            ...persistedState,
            settings: DEFAULT_PRACTICE_SETTINGS
          };
        }
        return persistedState;
      }
    }
  )
);