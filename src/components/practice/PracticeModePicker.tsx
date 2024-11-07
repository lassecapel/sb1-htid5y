import React from 'react';
import { BookOpen, Type, FileText, Sparkles } from 'lucide-react';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useSubscriptionFeatures } from '../../hooks/useSubscriptionFeatures';

interface PracticeModePickerProps {
  onSelect: (mode: string) => void;
}

const PRACTICE_MODES = [
  {
    id: 'flashcards',
    name: 'Flashcards',
    icon: BookOpen,
    description: 'Classic flashcard practice',
    tier: 'free'
  },
  {
    id: 'vowels',
    name: 'Vowels Only',
    icon: Type,
    description: 'Practice with only vowels shown',
    tier: 'premium'
  },
  {
    id: 'consonants',
    name: 'Consonants Only',
    icon: Type,
    description: 'Practice with only consonants shown',
    tier: 'premium'
  },
  {
    id: 'context',
    name: 'Contextual Learning',
    icon: FileText,
    description: 'Practice with AI-generated sentences',
    tier: 'pro'
  }
];

export function PracticeModePicker({ onSelect }: PracticeModePickerProps) {
  const { currentSubscription } = useSubscriptionStore();
  const { checkFeatureAccess } = useSubscriptionFeatures();

  const canAccessMode = (tier: string): boolean => {
    if (tier === 'free') return true;
    if (tier === 'premium') return ['premium', 'pro'].includes(currentSubscription?.tier || '');
    if (tier === 'pro') return currentSubscription?.tier === 'pro';
    return false;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {PRACTICE_MODES.map((mode) => {
        const hasAccess = canAccessMode(mode.tier);
        
        return (
          <button
            key={mode.id}
            onClick={() => hasAccess && onSelect(mode.id)}
            className={`relative p-6 rounded-xl border-2 transition-all ${
              hasAccess
                ? 'border-primary-200 hover:border-primary-500 bg-white dark:bg-gray-800'
                : 'border-gray-200 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed'
            }`}
          >
            {!hasAccess && (
              <div className="absolute inset-0 bg-gray-900/5 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Sparkles size={16} />
                  {mode.tier.charAt(0).toUpperCase() + mode.tier.slice(1)} Feature
                </div>
              </div>
            )}

            <mode.icon className="text-primary-500 mb-4" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {mode.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {mode.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}