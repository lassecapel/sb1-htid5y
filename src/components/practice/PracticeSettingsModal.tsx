import React from 'react';
import { Settings, X, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePracticeSettingsStore } from '../../stores/practiceSettingsStore';
import type { PracticeSettings } from '../../types/practiceSettings';

interface PracticeSettingsModalProps {
  mode: keyof PracticeSettings;
  onClose: () => void;
}

export function PracticeSettingsModal({ mode, onClose }: PracticeSettingsModalProps) {
  const { t } = useTranslation();
  const { settings, updateModeSettings } = usePracticeSettingsStore();
  const modeSettings = settings[mode];
  const generalSettings = settings.general;

  const handleGeneralSettingChange = <K extends keyof PracticeSettings['general']>(
    key: K,
    value: PracticeSettings['general'][K]
  ) => {
    updateModeSettings('general', { [key]: value });
  };

  const handleModeSettingChange = <K extends keyof typeof modeSettings>(
    key: K,
    value: typeof modeSettings[K]
  ) => {
    updateModeSettings(mode, { [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Settings className="text-primary-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('practice.settings.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('practice.settings.general')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={generalSettings.randomOrder}
                  onChange={(e) => handleGeneralSettingChange('randomOrder', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('practice.settings.randomOrder')}
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={generalSettings.caseSensitive}
                  onChange={(e) => handleGeneralSettingChange('caseSensitive', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('practice.settings.caseSensitive')}
                </span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('practice.settings.errorTolerance')}
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={generalSettings.errorTolerance}
                  onChange={(e) => handleGeneralSettingChange('errorTolerance', Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {generalSettings.errorTolerance}%
                </div>
              </div>
            </div>
          </section>

          {/* Mode-specific Settings */}
          {mode === 'flashcards' && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('practice.settings.flashcards')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('practice.settings.revealTime')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.flashcards.revealTime}
                    onChange={(e) => handleModeSettingChange('revealTime', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.flashcards.autoFlip}
                    onChange={(e) => handleModeSettingChange('autoFlip', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('practice.settings.autoFlip')}
                  </span>
                </label>
              </div>
            </section>
          )}

          {mode === 'writing' && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('practice.settings.writing')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.writing.showHint}
                    onChange={(e) => handleModeSettingChange('showHint', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('practice.settings.showHint')}
                  </span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('practice.settings.hintLength')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={settings.writing.hintLength}
                    onChange={(e) => handleModeSettingChange('hintLength', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500"
                  />
                </div>
              </div>
            </section>
          )}

          {mode === 'quiz' && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('practice.settings.quiz')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('practice.settings.optionCount')}
                  </label>
                  <select
                    value={settings.quiz.optionCount}
                    onChange={(e) => handleModeSettingChange('optionCount', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500"
                  >
                    {[2, 3, 4, 5, 6].map(count => (
                      <option key={count} value={count}>{count}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.quiz.showPartialMatches}
                    onChange={(e) => handleModeSettingChange('showPartialMatches', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('practice.settings.showPartialMatches')}
                  </span>
                </label>
              </div>
            </section>
          )}

          {mode === 'listening' && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('practice.settings.listening')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('practice.settings.playbackSpeed')}
                  </label>
                  <select
                    value={settings.listening.playbackSpeed}
                    onChange={(e) => handleModeSettingChange('playbackSpeed', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500"
                  >
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <option key={speed} value={speed}>{speed}x</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('practice.settings.maxRepeats')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.listening.maxRepeats}
                    onChange={(e) => handleModeSettingChange('maxRepeats', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500"
                  />
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-colors flex items-center gap-2"
          >
            <Save size={20} />
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}