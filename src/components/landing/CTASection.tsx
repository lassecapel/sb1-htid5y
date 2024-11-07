import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function CTASection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-12 shadow-xl">
          <div className="inline-block text-white mb-6">
            <Sparkles size={48} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('landing.cta.title', 'Ready to Start Your Language Journey?')}
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            {t('landing.cta.subtitle', 'Join thousands of successful learners today. Start for free!')}
          </p>
          
          <button
            onClick={() => navigate('/app')}
            className="px-8 py-4 bg-white text-primary-500 rounded-xl font-medium hover:bg-gray-50 transition-colors transform hover:scale-105 flex items-center gap-2 mx-auto group"
          >
            Start Learning Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-white/80 mt-6 text-sm">
            {t('landing.cta.noCommitment', 'No credit card required. Start learning instantly.')}
          </p>
        </div>
      </div>
    </section>
  );
}