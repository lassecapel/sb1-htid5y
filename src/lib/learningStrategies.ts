import { Word, TestResult } from '../types';

export interface LearningStrategy {
  name: string;
  description: string;
  getNextWord: (words: Word[], history: TestResult[]) => Word;
  shouldRepeat: (word: Word, result: TestResult) => boolean;
  getHintLevel: (attempts: number, mistakes: number) => number;
}

export const strategies: Record<string, LearningStrategy> = {
  interleaved: {
    name: 'Interleaved Practice',
    description: 'Mix different types of words to enhance learning transfer',
    getNextWord: (words, history) => {
      // Group words by category
      const categories = new Map<string, Word[]>();
      words.forEach(word => {
        if (!categories.has(word.category)) {
          categories.set(word.category, []);
        }
        categories.get(word.category)!.push(word);
      });

      // Get last practiced category
      const lastCategory = history[0]?.state.currentWord?.category;

      // Choose a different category than the last one
      const availableCategories = Array.from(categories.keys())
        .filter(cat => cat !== lastCategory);

      if (availableCategories.length === 0) {
        return words[Math.floor(Math.random() * words.length)];
      }

      const nextCategory = availableCategories[
        Math.floor(Math.random() * availableCategories.length)
      ];

      const categoryWords = categories.get(nextCategory)!;
      return categoryWords[Math.floor(Math.random() * categoryWords.length)];
    },
    shouldRepeat: (word, result) => {
      const wordResults = result.answers.filter(a => a.wordId === word.id);
      return wordResults.some(r => !r.isCorrect);
    },
    getHintLevel: (attempts, mistakes) => Math.min(3, Math.floor(mistakes / 2))
  },

  retrievalPractice: {
    name: 'Retrieval Practice',
    description: 'Emphasize active recall with increasing difficulty',
    getNextWord: (words, history) => {
      // Calculate success rate for each word
      const successRates = new Map<string, number>();
      words.forEach(word => {
        const attempts = history.flatMap(h => 
          h.answers.filter(a => a.wordId === word.id)
        );
        if (attempts.length === 0) return;
        const successRate = attempts.filter(a => a.isCorrect).length / attempts.length;
        successRates.set(word.id, successRate);
      });

      // Prioritize words with lower success rates
      return words.sort((a, b) => {
        const aRate = successRates.get(a.id) ?? 1;
        const bRate = successRates.get(b.id) ?? 1;
        return aRate - bRate;
      })[0];
    },
    shouldRepeat: (word, result) => {
      const wordResults = result.answers.filter(a => a.wordId === word.id);
      const successRate = wordResults.filter(r => r.isCorrect).length / wordResults.length;
      return successRate < 0.8; // Repeat until 80% success rate
    },
    getHintLevel: (attempts, mistakes) => {
      if (attempts === 1) return 0;
      return Math.min(2, Math.floor(mistakes / 3));
    }
  },

  adaptiveDifficulty: {
    name: 'Adaptive Difficulty',
    description: 'Automatically adjust difficulty based on performance',
    getNextWord: (words, history) => {
      if (history.length === 0) {
        return words.sort((a, b) => a.complexity - b.complexity)[0];
      }

      const lastResult = history[0];
      const successRate = lastResult.correctCount / lastResult.totalCount;

      // Adjust target complexity based on performance
      const currentComplexity = words.find(
        w => w.id === lastResult.state.currentWord?.id
      )?.complexity ?? 1;

      const targetComplexity = successRate > 0.8 
        ? currentComplexity + 1 
        : successRate < 0.6 
          ? Math.max(1, currentComplexity - 1)
          : currentComplexity;

      // Find words closest to target complexity
      return words.sort((a, b) => 
        Math.abs(a.complexity - targetComplexity) - 
        Math.abs(b.complexity - targetComplexity)
      )[0];
    },
    shouldRepeat: (word, result) => {
      const wordResults = result.answers.filter(a => a.wordId === word.id);
      return wordResults.length < 3 || // Minimum 3 attempts
        wordResults.slice(-2).some(r => !r.isCorrect); // Must get last 2 correct
    },
    getHintLevel: (attempts, mistakes) => {
      if (mistakes === 0) return 0;
      return Math.min(3, Math.max(0, attempts - mistakes));
    }
  }
};