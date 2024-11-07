import React, { useState, useEffect } from 'react';
import { Volume2, Star, Check, X as XIcon } from 'lucide-react';
import type { Word } from '../../types';
import { getMatchScore } from '../../utils/matching';
import { useTranslation } from 'react-i18next';

interface PracticeCardProps {
  word: Word;
  type: string;
  onResult: (isCorrect: boolean, answer: any) => void;
  hint?: string;
  config: any;
}

export function PracticeCard({ word, type, onResult, hint, config }: PracticeCardProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime] = useState(Date.now());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && type !== 'flashcards') return;

    const timeSpent = Date.now() - startTime;
    const answer = input.trim();
    let isCorrect = false;

    if (type === 'flashcards') {
      isCorrect = true;
    } else {
      const matchScore = getMatchScore(answer.toLowerCase(), word.translations[0].value.toLowerCase());
      isCorrect = matchScore >= config.errorTolerance;
    }

    onResult(isCorrect, {
      wordId: word.id,
      givenAnswer: answer,
      correctAnswer: word.translations[0].value,
      isCorrect,
      matchScore: isCorrect ? 100 : 0,
      timeSpent,
      attempts: 1
    });

    setInput('');
    setShowAnswer(false);
  };

  useEffect(() => {
    setInput('');
    setShowAnswer(false);
  }, [word]);

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.translations[0].value);
      utterance.lang = word.translations[0].languageCode || 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-4 py-2 rounded-full">
            {word.category}
          </div>
          <button
            onClick={handlePlayAudio}
            className="text-gray-400 hover:text-primary-500 transition-colors"
          >
            <Volume2 size={24} />
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {word.translations[0].value}
          </h2>
          {hint && (
            <p className="text-primary-500 dark:text-primary-400 text-lg">
              Hint: {hint}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type !== 'flashcards' && (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('practice.enterTranslation')}
              autoFocus
            />
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 rounded-xl text-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-colors"
          >
            {type === 'flashcards' ? t('practice.showAnswer') : t('practice.checkAnswer')}
          </button>
        </form>
      </div>
    </div>
  );
}