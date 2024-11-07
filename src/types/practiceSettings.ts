import { z } from 'zod';

export const PracticeSettingsSchema = z.object({
  general: z.object({
    randomOrder: z.boolean().default(true),
    caseSensitive: z.boolean().default(false),
    errorTolerance: z.number().min(50).max(100).default(85),
    feedbackDelay: z.number().min(500).max(5000).default(1500),
    showTimer: z.boolean().default(true),
    autoAdvance: z.boolean().default(true)
  }),
  flashcards: z.object({
    revealTime: z.number().min(1).max(10).default(5),
    autoFlip: z.boolean().default(false),
    showProgress: z.boolean().default(true)
  }),
  writing: z.object({
    showHint: z.boolean().default(true),
    hintLength: z.number().min(1).max(3).default(1),
    ignoreAccents: z.boolean().default(true),
    ignorePunctuation: z.boolean().default(true)
  }),
  quiz: z.object({
    optionCount: z.number().min(2).max(6).default(4),
    showPartialMatches: z.boolean().default(true),
    timeLimit: z.number().nullable().default(null)
  }),
  listening: z.object({
    autoPlay: z.boolean().default(true),
    playbackSpeed: z.number().min(0.5).max(2).default(1),
    maxRepeats: z.number().min(1).max(10).default(3)
  })
});

export type PracticeSettings = z.infer<typeof PracticeSettingsSchema>;

export const DEFAULT_PRACTICE_SETTINGS: PracticeSettings = {
  general: {
    randomOrder: true,
    caseSensitive: false,
    errorTolerance: 85,
    feedbackDelay: 1500,
    showTimer: true,
    autoAdvance: true
  },
  flashcards: {
    revealTime: 5,
    autoFlip: false,
    showProgress: true
  },
  writing: {
    showHint: true,
    hintLength: 1,
    ignoreAccents: true,
    ignorePunctuation: true
  },
  quiz: {
    optionCount: 4,
    showPartialMatches: true,
    timeLimit: null
  },
  listening: {
    autoPlay: true,
    playbackSpeed: 1,
    maxRepeats: 3
  }
};