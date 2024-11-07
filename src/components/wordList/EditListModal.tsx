import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../utils/languages';
import type { Language, WordList } from '../../types';
import { useTranslation } from 'react-i18next';

interface EditListModalProps {
  list: WordList;
  onClose: () => void;
  onSubmit: (updates: Partial<WordList>) => Promise<void>;
}

export function EditListModal({ list, onClose, onSubmit }: EditListModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(list.title);
  const [description, setDescription] = useState(list.description);
  const [fromLanguage, setFromLanguage] = useState<Language>(list.fromLanguage);
  const [toLanguage, setToLanguage] = useState<Language>(list.toLanguage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('wordList.errors.titleRequired'));
      return;
    }
    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        fromLanguage,
        toLanguage
      });
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('wordList.edit.title')}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('wordList.create.nameLabel')}*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-400 dark:focus:border-primary-500 focus:ring focus:ring-primary-200 dark:focus:ring-primary-500/20 focus:ring-opacity-50"
              placeholder={t('wordList.create.namePlaceholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('wordList.create.descriptionLabel')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-400 dark:focus:border-primary-500 focus:ring focus:ring-primary-200 dark:focus:ring-primary-500/20 focus:ring-opacity-50 h-24"
              placeholder={t('wordList.create.descriptionPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('wordList.create.fromLanguage')}
              </label>
              <select
                value={fromLanguage.code}
                onChange={(e) => setFromLanguage(
                  SUPPORTED_LANGUAGES.find(l => l.code === e.target.value) || SUPPORTED_LANGUAGES[0]
                )}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-400 dark:focus:border-primary-500 focus:ring focus:ring-primary-200 dark:focus:ring-primary-500/20 focus:ring-opacity-50"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('wordList.create.toLanguage')}
              </label>
              <select
                value={toLanguage.code}
                onChange={(e) => setToLanguage(
                  SUPPORTED_LANGUAGES.find(l => l.code === e.target.value) || SUPPORTED_LANGUAGES[1]
                )}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-400 dark:focus:border-primary-500 focus:ring focus:ring-primary-200 dark:focus:ring-primary-500/20 focus:ring-opacity-50"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {loading ? t('common.saving') : t('common.save')}
          </button>
        </form>
      </div>
    </div>
  );
}