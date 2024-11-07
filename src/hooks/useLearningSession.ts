import { useState, useEffect, useCallback } from 'react';
import { useTestResultStore } from '../stores/testResultStore';
import { calculateNextReview, calculateRecallQuality } from '../lib/spaceRepetition';
import { strategies, LearningStrategy } from '../lib/learningStrategies';
import type { Word, TestResult } from '../types';

interface LearningSessionConfig {
  strategy: keyof typeof strategies;
  sessionLength?: number; // in minutes
  minRepetitions?: number;
  maxMistakesBeforeHint?: number;
}

export function useLearningSession(
  words: Word[],
  config: LearningSessionConfig
) {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [sessionHistory, setSessionHistory] = useState<TestResult[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const { saveTestResult } = useTestResultStore();

  const strategy = strategies[config.strategy];

  const selectNextWord = useCallback(() => {
    if (words.length === 0) {
      setCurrentWord(null);
      return;
    }

    const nextWord = strategy.getNextWord(words, sessionHistory);
    setCurrentWord(nextWord);
    setAttempts(0);
    setMistakes(0);
  }, [words, sessionHistory, strategy]);

  useEffect(() => {
    selectNextWord();
  }, [selectNextWord]);

  const handleAnswer = useCallback(async (
    answer: string,
    timeSpent: number
  ) => {
    if (!currentWord) return;

    const isCorrect = currentWord.translations.some(t => 
      t.value.toLowerCase() === answer.toLowerCase()
    );

    if (!isCorrect) {
      setMistakes(prev => prev + 1);
    }

    setAttempts(prev => prev + 1);

    const result: TestResult = {
      id: Date.now().toString(),
      userId: 'current-user',
      wordListId: 'current-list',
      type: 'writing',
      answers: [{
        wordId: currentWord.id,
        givenAnswer: answer,
        correctAnswer: currentWord.translations[0].value,
        isCorrect,
        matchScore: isCorrect ? 100 : 0,
        timeSpent,
        attempts
      }],
      startedAt: new Date(Date.now() - timeSpent),
      completedAt: new Date(),
      totalTime: timeSpent,
      correctCount: isCorrect ? 1 : 0,
      totalCount: 1,
      score: isCorrect ? 100 : 0,
      state: {
        wordOrder: [currentWord.id],
        currentIndex: 0,
        remainingWords: [],
        mistakeWords: isCorrect ? [] : [currentWord.id]
      }
    };

    // Update spaced repetition data
    const quality = calculateRecallQuality(result);
    const nextReview = calculateNextReview(quality, currentWord.spacedRepetitionData);

    // Save result and update history
    await saveTestResult(result);
    setSessionHistory(prev => [result, ...prev]);

    // Check if word needs to be repeated
    if (strategy.shouldRepeat(currentWord, result)) {
      // Add word back to the queue
      words.push(currentWord);
    }

    selectNextWord();
  }, [currentWord, attempts, strategy, saveTestResult, selectNextWord, words]);

  const getHint = useCallback(() => {
    if (!currentWord) return '';

    const hintLevel = strategy.getHintLevel(attempts, mistakes);
    const correctAnswer = currentWord.translations[0].value;

    switch (hintLevel) {
      case 1: // Show first letter
        return correctAnswer[0] + '...';
      case 2: // Show first and last letter
        return correctAnswer[0] + '...' + correctAnswer[correctAnswer.length - 1];
      case 3: // Show every other letter
        return correctAnswer
          .split('')
          .map((char, i) => i % 2 === 0 ? char : '_')
          .join('');
      default:
        return '';
    }
  }, [currentWord, attempts, mistakes, strategy]);

  return {
    currentWord,
    sessionHistory,
    attempts,
    mistakes,
    handleAnswer,
    getHint
  };
}