import React from 'react';
import { Brain, TrendingUp, Clock, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PracticeStatsProps {
  correctStreak: number;
  accuracy: number;
  averageTime: number;
  masteryLevel: number;
}

export function PracticeStats({ 
  correctStreak, 
  accuracy, 
  averageTime,
  masteryLevel 
}: PracticeStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
          <Brain className="text-primary-500" size={24} />
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('practice.stats.streak')}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {correctStreak}
          </div>
        </div>
      </div>

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
          <TrendingUp className="text-green-500" size={24} />
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('practice.stats.accuracy')}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {accuracy.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
          <Clock className="text-blue-500" size={24} />
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('practice.stats.avgTime')}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {averageTime.toFixed(1)}s
          </div>
        </div>
      </div>

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-secondary-50 dark:bg-secondary-900/50 rounded-lg">
          <Target className="text-secondary-500" size={24} />
        </div>
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('practice.stats.mastery')}
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {masteryLevel.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}