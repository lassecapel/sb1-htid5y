export interface PracticeConfig {
  // General settings
  mode: 'single' | 'repeat';
  duration: number | null; // in minutes, null for unlimited
  randomOrder: boolean;
  caseSensitive: boolean;
  errorTolerance: number; // percentage, e.g., 85 means 85% match required
  feedbackFrequency: 'always' | 'mistakes' | 'end';
  
  // Word repetition settings
  minRepetitions: number;
  maxMistakesBeforeHint: number;
  reviewMistakes: boolean;
  
  // Special character handling
  ignoreAccents: boolean;
  ignorePunctuation: boolean;
  
  // Mode-specific settings
  flashcards: {
    revealTime: number; // in seconds
    autoFlip: boolean;
  };
  writing: {
    showHint: boolean;
    hintLength: number;
  };
  quiz: {
    optionCount: number;
    showPartialMatches: boolean;
  };
  listening: {
    autoPlay: boolean;
    playbackSpeed: number;
    maxRepeats: number;
  };
}

export const DEFAULT_PRACTICE_CONFIG: PracticeConfig = {
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
};