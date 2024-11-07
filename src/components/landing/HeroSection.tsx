import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../utils/languages';

interface HeroSectionProps {
  onLearnMore: (e: React.MouseEvent) => void;
}

export function HeroSection({ onLearnMore }: HeroSectionProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
            {t('landing.hero.title1', 'Master New Languages')}
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">
            {t('landing.hero.title2', 'One Word at a Time')}
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {t('landing.hero.subtitle', 'Scientifically proven methods to help you learn and retain vocabulary effectively. Start your language journey today!')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/app')}
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 flex items-center gap-2"
          >
            Start Learning Now
            <ArrowRight size={20} />
          </button>
          <button
            onClick={onLearnMore}
            className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
          >
            <ArrowRight size={20} />
            {t('landing.hero.learnMoreButton', 'Learn More')}
          </button>
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-4 mt-12">
        {SUPPORTED_LANGUAGES.slice(0, 6).map((lang, index) => (
          <div
            key={lang.code}
            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-900 dark:text-white font-medium animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {lang.name}
          </div>
        ))}
      </div>
    </div>
  );
}