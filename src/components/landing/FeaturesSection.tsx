import React from 'react';
import { Brain, Target, BarChart3, Globe2 } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'Smart Learning',
    description: 'Adaptive algorithms personalize your learning path based on performance'
  },
  {
    icon: Target,
    title: 'Spaced Repetition',
    description: 'Scientific method ensures long-term vocabulary retention'
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Detailed analytics help you stay motivated and focused'
  },
  {
    icon: Globe2,
    title: 'Multiple Languages',
    description: 'Learn any of our 10+ supported languages effectively'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose Wordzy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-primary-500 mb-4">
                <Icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}