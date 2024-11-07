import { useState, useEffect } from 'react';
import { usePracticeSettingsStore } from '../stores/practiceSettingsStore';
import { useTestResultStore } from '../stores/testResultStore';
import type { Word, TestResult, TestAnswer } from '../types';

interface PracticeSession {
  currentWord: Word | null;
  progress: {
    current: number;
    total: number;
    correct: number;
  };
  settings: ReturnType<typeof usePracticeSettingsStore>['settings'];
  submitAnswer: (answer: string) => Promise<void>;
  finishSession: () => Promise<void>;
}

export function usePracticeSession(
  words: Word[],
  mode: string,
  listId: string
): PracticeSession {
  const { settings } = usePracticeSettingsStore();
  const { saveTestResult } = useTestResultStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [startTime] = useState(new Date());

  // Initialize word order based on settings
  const [wordOrder] = useState(() => {
    const order = [...Array(words.length).keys()];
    if (settings.general.randomOrder) {
      return order.sort(() => Math.random() - 0.5);
    }
    return order;
  });

  const currentWord = currentIndex < words.length ? words[wordOrder[currentIndex]] : null;

  const submitAnswer = async (answer: string) => {
    if (!currentWord) return;

    const correctAnswer = currentWord.translations[0].value;
    const isCorrect = settings.general.caseSensitive
      ? answer === correctAnswer
      : answer.toLowerCase() === correctAnswer.toLowerCase();

    const testAnswer: TestAnswer = {
      wordId: currentWord.id,
      givenAnswer: answer,
      correctAnswer,
      isCorrect,
      matchScore: isCorrect ? 100 : 0,
      timeSpent: Date.now() - startTime.getTime(),
      attempts: 1
    };

    setAnswers(prev => [...prev, testAnswer]);
    if (isCorrect) setCorrectCount(prev => prev + 1);
    setCurrentIndex(prev => prev + 1);
  };

  const finishSession = async () => {
    const endTime = new Date();
    const testResult: Omit<TestResult, 'id'> = {
      userId: 'current-user', // Replace with actual user ID
      wordListId: listId,
      type: mode as any,
      answers,
      startedAt: startTime,
      completedAt: endTime,
      totalTime: endTime.getTime() - startTime.getTime(),
      correctCount,
      totalCount: words.length,
      score: (correctCount / words.length) * 100,
      state: {
        wordOrder: wordOrder.map(index => words[index].id),
        currentIndex,
        remainingWords: wordOrder.slice(currentIndex).map(index => words[index].id),
        mistakeWords: answers
          .filter(a => !a.isCorrect)
          .map(a => a.wordId)
      }
    };

    await saveTestResult(testResult);
  };

  useEffect(() => {
    if (currentIndex === words.length) {
      finishSession();
    }
  }, [currentIndex, words.length]);

  return {
    currentWord,
    progress: {
      current: currentIndex + 1,
      total: words.length,
      correct: correctCount
    },
    settings,
    submitAnswer,
    finishSession
  };
}