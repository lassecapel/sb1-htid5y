import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWordLists } from '../../hooks/useWordLists';
import { useWordStore } from '../../stores/wordStore';
import { SUPPORTED_LANGUAGES } from '../../utils/languages';
import { useTranslation } from 'react-i18next';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Language, Word, Translation } from '../../types';

export function EditWordListPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lists, updateList } = useWordLists();
  const { words } = useWordStore();
  const list = lists.find(l => l.id === id);

  const [title, setTitle] = useState(list?.title || '');
  const [description, setDescription] = useState(list?.description || '');
  const [fromLanguage, setFromLanguage] = useState<Language>(list?.fromLanguage || SUPPORTED_LANGUAGES[0]);
  const [toLanguage, setToLanguage] = useState<Language>(list?.toLanguage || SUPPORTED_LANGUAGES[1]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle both new database structure and sample data format
  const listWords = list?.words.map(word => {
    // If word is a string (ID), get it from the word store
    if (typeof word === 'string') {
      return words[word];
    }
    // If word is an object (sample data), convert it to our new format
    const wordId = word.id || uuidv4();
    return {
      id: wordId,
      category: word.category || 'uncategorized',
      complexity: word.complexity || 1,
      translations: [
        {
          id: uuidv4(),
          wordId: wordId,
          languageCode: fromLanguage.code,
          value: word.value
        },
        {
          id: uuidv4(),
          wordId: wordId,
          languageCode: toLanguage.code,
          value: word.translations[0].value
        }
      ]
    };
  }).filter(Boolean) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!list) return;

    if (!title.trim()) {
      setError(t('wordList.errors.titleRequired'));
      return;
    }

    try {
      setLoading(true);
      await updateList(list.id, {
        title: title.trim(),
        description: description.trim(),
        fromLanguage,
        toLanguage
      });
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWord = async (wordId: string) => {
    if (!list) return;

    try {
      const updatedWords = list.words.filter(w => {
        if (typeof w === 'string') return w !== wordId;
        return w.id !== wordId;
      });

      await updateList(list.id, {
        ...list,
        words: updatedWords
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : t('common.error'));
    }
  };

  if (!list) {
    return (
      <div className="text-center text-red-600 bg-red-50 dark:bg-red-900/50 rounded-xl p-4">
        {t('wordList.errors.notFound')}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
        >
          <ArrowLeft size={20} />
          {t('common.back')}
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('wordList.edit.title')}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('wordList.create.nameLabel')}*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-400 dark:focus:border-primary-500 focus:ring focus:ring-primary-200 dark:focus:ring-primary-500/20 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('wordList.create.descriptionLabel')}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-400 dark:focus:border-primary-500 focus:ring focus:ring-primary-200 dark:focus:ring-primary-500/20 focus:ring-opacity-50"
              />
            </div>

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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('wordList.edit.words')}
          </h2>
          <button
            onClick={() => {/* TODO: Add word modal */}}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border-2 border-primary-500 dark:border-primary-600 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/50 transition-colors"
          >
            <Plus size={16} />
            {t('wordList.edit.addWord')}
          </button>
        </div>

        <div className="space-y-4">
          {listWords.map(word => (
            <div
              key={word.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-100 dark:border-gray-600"
            >
              <div className="grid grid-cols-2 gap-8 flex-1">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {fromLanguage.name}
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {word.translations.find(t => t.languageCode === fromLanguage.code)?.value}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {toLanguage.name}
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {word.translations.find(t => t.languageCode === toLanguage.code)?.value}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveWord(word.id)}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}