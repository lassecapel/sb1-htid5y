import React from 'react';
import { Settings, X, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PracticeConfig } from '../../types/practiceConfig';

interface PracticeSettingsProps {
  config: PracticeConfig;
  onChange: (config: PracticeConfig) => void;
  onClose: () => void;
  practiceType: string;
}

export function PracticeSettings({ config, onChange, onClose, practiceType }: PracticeSettingsProps) {
  const { t } = useTranslation();
  const [localConfig, setLocalConfig] = React.useState(config);

  const handleChange = <K extends keyof PracticeConfig>(
    key: K,
    value: PracticeConfig[K]
  ) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleModeSpecificChange = <K extends keyof PracticeConfig[typeof practiceType]>(
    key: K,
    value: PracticeConfig[typeof practiceType][K]
  ) => {
    setLocalConfig(prev => ({
      ...prev,
      [practiceType]: {
        ...prev[practiceType],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    onChange(localConfig);
    onClose();
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('practice.settings.mode')}
                </label>
                <select
                  value={localConfig.mode}
                  onChange={(e) => handleChange('mode', e.target.value as 'single' | 'repeat')}
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400"
                >
                  <option value="single">{t('practice.settings.modes.single')}</option>
                  <option value="repeat">{t('practice.settings.modes.repeat')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('practice.settings.duration')}
                </label>
                <input
                  type="number"
                  value={localConfig.duration || ''}
                  onChange={(e) => handleChange('duration', e.target.value ? Number(e.target.value) : null)}
                  placeholder={t('practice.settings.unlimited')}
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('practice.settings.errorTolerance')}
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={localConfig.errorTolerance}
                  onChange={(e) => handleChange('errorTolerance', Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {localConfig.errorTolerance}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('practice.settings.feedback')}
                </label>
                <select
                  value={localConfig.feedbackFrequency}
                  onChange={(e) => handleChange('feedbackFrequency', e.target.value as PracticeConfig['feedbackFrequency'])}
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400"
                >
                  <option value="always">{t('practice.settings.feedback.always')}</option>
                  <option value="mistakes">{t('practice.settings.feedback.mistakes')}</option>
                  <option value="end">{t('practice.settings.feedback.end')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localConfig.randomOrder}
                  onChange={(e) => handleChange('randomOrder', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('practice.settings.randomOrder')}
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localConfig.caseSensitive}
                  onChange={(e) => handleChange('caseSensitive', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('practice.settings.caseSensitive')}
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localConfig.ignoreAccents}
                  onChange={(e) => handleChange('ignoreAccents', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('practice.settings.ignoreAccents')}
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localConfig.ignorePunctuation}
                  onChange={(e) => handleChange('ignorePunctuation', e.target.checked)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('practice.settings.ignorePunctuation')}
                </span>
              </label>
            </div>
          </section>

          {/* Mode-specific Settings */}
          {practiceType === 'flashcards' && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('practice.settings.flashcards')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('practice.settings.flashcards.revealTime')}
                  </label>
                  <input
                    type="number"
                    value={localConfig.flashcards.revealTime}
                    onChange={(e) => handleModeSpecificChange('revealTime', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localConfig.flashcards.autoFlip}
                    onChange={(e) => handleModeSpecificChange('autoFlip', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('practice.settings.flashcards.autoFlip')}
                  </span>
                </label>
              </div>
            </section>
          )}

          {practiceType === 'writing' && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('practice.settings.writing')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localConfig.writing.showHint}
                    onChange={(e) => handleModeSpecificChange('showHint', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('practice.settings.writing.showHint')}
                  </span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('practice.settings.writing.hintLength')}
                  </label>
                  <input
                    type="number"
                    value={localConfig.writing.hintLength}
                    onChange={(e) => handleModeSpecificChange('hintLength', Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400"
                  />
                </div>
              </div>
            </section>
          )}

          {practiceType === 'listening' && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('practice.settings.listening')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('practice.settings.listening.playbackSpeed')}
                  </label>
                  <select
                    value={localConfig.listening.playbackSpeed}
                    onChange={(e) => handleModeSpecificChange('playbackSpeed', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('practice.settings.listening.maxRepeats')}
                  </label>
                  <input
                    type="number"
                    value={localConfig.listening.maxRepeats}
                    onChange={(e) => handleModeSpecificChange('maxRepeats', Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localConfig.listening.autoPlay}
                    onChange={(e) => handleModeSpecificChange('autoPlay', e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('practice.settings.listening.autoPlay')}
                  </span>
                </label>
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
            onClick={handleSave}
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