import React from 'react';
import { Settings, Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../stores/themeStore';
import { SUPPORTED_LANGUAGES } from '../../utils/languages';
import { useConfigStore } from '../../stores/configStore';
import { ThemeToggle } from '../ThemeToggle';

const COLOR_SCHEMES = [
  { id: 'default', name: 'Default', primary: '#f43f5e', secondary: '#0ea5e9' },
  { id: 'emerald', name: 'Emerald', primary: '#10b981', secondary: '#3b82f6' },
  { id: 'amber', name: 'Amber', primary: '#f59e0b', secondary: '#8b5cf6' },
  { id: 'rose', name: 'Rose', primary: '#f43f5e', secondary: '#6366f1' },
  { id: 'violet', name: 'Violet', primary: '#8b5cf6', secondary: '#ec4899' },
  { id: 'cyan', name: 'Cyan', primary: '#06b6d4', secondary: '#8b5cf6' },
  { id: 'indigo', name: 'Indigo', primary: '#6366f1', secondary: '#14b8a6' },
  { id: 'teal', name: 'Teal', primary: '#14b8a6', secondary: '#8b5cf6' },
  { id: 'purple', name: 'Purple', primary: '#a855f7', secondary: '#f43f5e' },
  { id: 'orange', name: 'Orange', primary: '#f97316', secondary: '#6366f1' },
];

export function ConfigurationScreen() {
  const { t, i18n } = useTranslation();
  const { defaultLanguage, colorScheme, setDefaultLanguage, setColorScheme } = useConfigStore();

  const handleLanguageChange = (langCode: string) => {
    setDefaultLanguage(langCode);
    i18n.changeLanguage(langCode);
  };

  const handleColorSchemeChange = (schemeId: string) => {
    setColorScheme(schemeId);
    document.documentElement.setAttribute('data-color-scheme', schemeId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="text-primary-500" size={28} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('settings.title')}
          </h1>
        </div>

        <div className="space-y-12">
          {/* Language Settings */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe size={20} />
              {t('settings.language.title')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    defaultLanguage === lang.code
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  {defaultLanguage === lang.code && (
                    <Check
                      size={16}
                      className="absolute top-2 right-2 text-primary-500"
                    />
                  )}
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Theme Settings */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('settings.theme.title')}
            </h2>
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          </section>

          {/* Color Scheme Settings */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('settings.colorScheme.title')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {COLOR_SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => handleColorSchemeChange(scheme.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    colorScheme === scheme.id
                      ? 'border-primary-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  {colorScheme === scheme.id && (
                    <Check
                      size={16}
                      className="absolute top-2 right-2 text-primary-500"
                    />
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: scheme.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: scheme.secondary }}
                      />
                    </div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                      {scheme.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}