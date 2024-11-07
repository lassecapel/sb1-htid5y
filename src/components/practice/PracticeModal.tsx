import React, { useState } from 'react';
import { X, BookOpen, Pencil, List, Headphones, Type, FileText, Settings } from 'lucide-react';
import type { WordList } from '../../types';
import { PracticeSettings } from './PracticeSettings';
import { usePracticeConfigStore } from '../../stores/practiceConfigStore';
import { useTranslation } from 'react-i18next';

interface PracticeModalProps {
  list: WordList;
  onClose: () => void;
  onStartPractice: (type: string) => void;
}

const practiceTypes = [
  {
    id: 'flashcards',
    icon: BookOpen,
    title: 'Flashcards',
    description: 'Classic flashcard practice',
    tier: 'free'
  },
  {
    id: 'writing',
    icon: Pencil,
    title: 'Writing Practice',
    description: 'Write translations of words',
    tier: 'free'
  },
  {
    id: 'quiz',
    icon: List,
    title: 'Multiple Choice',
    description: 'Choose the correct translation',
    tier: 'free'
  },
  {
    id: 'listening',
    icon: Headphones,
    title: 'Listening Practice',
    description: 'Practice pronunciation and listening',
    tier: 'premium'
  },
  {
    id: 'vowels',
    icon: Type,
    title: 'Vowels Only',
    description: 'Practice with only vowels shown',
    tier: 'premium'
  },
  {
    id: 'context',
    icon: FileText,
    title: 'Contextual Learning',
    description: 'Practice with AI-generated sentences',
    tier: 'pro'
  }
];

export function PracticeModal({ list, onClose, onStartPractice }: PracticeModalProps) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { config } = usePracticeConfigStore();

  const handleStartPractice = () => {
    if (selectedMode) {
      onStartPractice(selectedMode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="practice-modal" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('practice.modal.title', { listTitle: list.title })}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('practice.modal.subtitle')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Practice Types Grid */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {practiceTypes.map(({ id, icon: Icon, title, description, tier }) => (
                <button
                  key={id}
                  onClick={() => setSelectedMode(id)}
                  className={`relative flex flex-col p-4 rounded-xl text-left transition-all ${
                    selectedMode === id
                      ? 'bg-primary-50 dark:bg-primary-900/50 border-2 border-primary-500 dark:border-primary-400'
                      : 'bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedMode === id
                        ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    </div>
                  </div>
                  {tier !== 'free' && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300">
                      {tier}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Settings size={18} />
              {t('practice.modal.settings')}
            </button>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleStartPractice}
                disabled={!selectedMode}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('practice.modal.start')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSettings && selectedMode && (
        <PracticeSettings
          mode={selectedMode}
          config={config}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}