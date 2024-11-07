import { PracticeConfig } from './practiceConfig';
import type { SubscriptionTier } from './subscription';

export interface AccountSettings {
  defaultLanguage: string;
  emailNotifications: {
    practiceReminders: boolean;
    weeklyProgress: boolean;
    newFeatures: boolean;
  };
  privacySettings: {
    shareProgress: boolean;
    publicProfile: boolean;
  };
}

export interface VisualPreferences {
  theme: 'light' | 'dark' | 'system';
  colorScheme: string;
  fontSize: 'small' | 'medium' | 'large';
  reduceAnimations: boolean;
  highContrast: boolean;
}

export interface TestSettings {
  autoAdvance: boolean;
  showTimer: boolean;
  showProgressBar: boolean;
  audioEnabled: boolean;
  defaultDuration: number | null;
  reviewIncorrectAnswers: boolean;
}

export interface AppConfig {
  account: AccountSettings;
  visual: VisualPreferences;
  test: TestSettings;
  practice: PracticeConfig;
}

export const DEFAULT_CONFIG: AppConfig = {
  account: {
    defaultLanguage: 'en',
    emailNotifications: {
      practiceReminders: true,
      weeklyProgress: true,
      newFeatures: true
    },
    privacySettings: {
      shareProgress: false,
      publicProfile: false
    }
  },
  visual: {
    theme: 'system',
    colorScheme: 'default',
    fontSize: 'medium',
    reduceAnimations: false,
    highContrast: false
  },
  test: {
    autoAdvance: true,
    showTimer: true,
    showProgressBar: true,
    audioEnabled: true,
    defaultDuration: null,
    reviewIncorrectAnswers: true
  },
  practice: {
    mode: 'single',
    duration: null,
    randomOrder: true,
    caseSensitive: false,
    errorTolerance: 85,
    feedbackFrequency: 'always',
    minRepetitions: 1,
    maxMistakesBeforeHint: 2,
    reviewMistakes: true,
    ignoreAccents: true,
    ignorePunctuation: true,
    flashcards: {
      revealTime: 5,
      autoFlip: false
    },
    writing: {
      showHint: true,
      hintLength: 1
    },
    quiz: {
      optionCount: 4,
      showPartialMatches: true
    },
    listening: {
      autoPlay: true,
      playbackSpeed: 1,
      maxRepeats: 3
    }
  }
};