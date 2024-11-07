export interface Language {
  code: string;
  name: string;
}

export interface Translation {
  id: string;
  wordId: string;
  languageCode: string;
  value: string;
  pronunciation?: string;
}

export interface Word {
  id: string;
  category: string;
  complexity: number;
  translations: Translation[];
}

export interface WordList {
  id: string;
  title: string;
  description: string;
  fromLanguage: Language;
  toLanguage: Language;
  words: string[]; // Array of word IDs
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestAnswer {
  wordId: string;
  givenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  matchScore: number;
  timeSpent: number; // in milliseconds
  attempts: number;
}

export interface TestResult {
  id: string;
  userId: string;
  wordListId: string;
  type: 'flashcards' | 'writing' | 'quiz' | 'listening';
  answers: TestAnswer[];
  startedAt: Date;
  completedAt: Date;
  totalTime: number; // in milliseconds
  correctCount: number;
  totalCount: number;
  score: number;
  state: {
    wordOrder: string[]; // Array of word IDs in the order they were presented
    currentIndex: number;
    remainingWords: string[]; // Array of word IDs that weren't tested yet
    mistakeWords: string[]; // Array of word IDs that were answered incorrectly
  };
}