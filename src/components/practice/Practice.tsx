import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWordLists } from '../../hooks/useWordLists';
import { useAuthStore } from '../../stores/authStore';
import { useTestResultStore } from '../../stores/testResultStore';
import { usePracticeConfigStore } from '../../stores/practiceConfigStore';
import { PracticeCard } from './PracticeCard';
import { ProgressBar } from '../ProgressBar';
import { PracticeComplete } from './PracticeComplete';
import { PracticeStats } from './PracticeStats';
import { useLearningSession } from '../../hooks/useLearningSession';
import type { TestAnswer } from '../../types';

export function Practice() {
  const { listId, type = 'flashcards' } = useParams();
  const navigate = useNavigate();
  const { lists } = useWordLists();
  const { user } = useAuthStore();
  const { config } = usePracticeConfigStore();
  const [showComplete, setShowComplete] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const list = lists.find(l => l.id === listId);

  const {
    currentWord,
    sessionHistory,
    handleAnswer,
    getHint
  } = useLearningSession(list?.words || [], {
    strategy: 'adaptiveDifficulty',
    sessionLength: config.duration || undefined,
    minRepetitions: config.minRepetitions,
    maxMistakesBeforeHint: config.maxMistakesBeforeHint
  });

  useEffect(() => {
    if (!user || !list) {
      navigate('/');
    }
  }, [user, list, navigate]);

  const handleResult = async (isCorrect: boolean, answer: TestAnswer) => {
    if (!currentWord) return;

    // Update stats
    setTotalAnswers(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setCorrectStreak(prev => prev + 1);
    } else {
      setCorrectStreak(0);
    }

    // Handle answer in learning session
    await handleAnswer(answer.givenAnswer, answer.timeSpent);

    // Check if session is complete
    if (!currentWord || showComplete) {
      setShowComplete(true);
    }
  };

  if (!list || !currentWord) {
    return null;
  }

  if (showComplete) {
    return (
      <PracticeComplete
        correctCount={correctAnswers}
        totalCount={totalAnswers}
        onFinish={() => navigate('/')}
      />
    );
  }

  const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
  const averageTime = sessionHistory.length > 0
    ? sessionHistory.reduce((sum, result) => sum + result.totalTime, 0) / (sessionHistory.length * 1000)
    : 0;
  const masteryLevel = (correctStreak / config.minRepetitions) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <PracticeStats
        correctStreak={correctStreak}
        accuracy={accuracy}
        averageTime={averageTime}
        masteryLevel={masteryLevel}
      />

      <div className="mb-8">
        <ProgressBar 
          current={totalAnswers + 1}
          total={list.words.length * config.minRepetitions}
          correct={correctAnswers}
        />
      </div>

      <div className="flex justify-center">
        <PracticeCard
          word={currentWord}
          type={type}
          onResult={handleResult}
          hint={getHint()}
          config={config}
        />
      </div>
    </div>
  );
}