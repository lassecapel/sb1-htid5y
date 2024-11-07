import React from 'react';
import { Star, Users, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { WordList } from '../../types';
import { useTranslation } from 'react-i18next';

interface WordListCardProps {
  list: WordList;
  onPractice: () => void;
}

export function WordListCard({ list, onPractice }: WordListCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{list.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{list.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Users className="text-gray-400 dark:text-gray-500" size={20} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t('wordList.stats.words', { count: list.words?.length || 0 })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate(`/wordlist/${list.id}/edit`)}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Edit size={16} className="inline-block mr-1" />
          {t('wordList.actions.edit')}
        </button>
        <button
          onClick={onPractice}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-colors"
        >
          {t('wordList.actions.practice')}
        </button>
      </div>
    </div>
  );
}