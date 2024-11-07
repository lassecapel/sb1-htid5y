import React from 'react';
import { Check, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PRICING_PLANS } from '../../types/subscription';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { useAuthStore } from '../../stores/authStore';

export function PricingPlans() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { currentSubscription, subscribe, isLoading } = useSubscriptionStore();

  const handleSubscribe = async (tier: string) => {
    if (!user) return;
    try {
      await subscribe(tier);
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('subscription.pricing.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('subscription.pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => {
            const isCurrentPlan = currentSubscription?.tier === plan.tier;
            
            return (
              <div
                key={plan.tier}
                className={`relative rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-8 ${
                  plan.highlighted ? 'ring-4 ring-primary-500' : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      <Star size={16} />
                      {t('subscription.pricing.mostPopular')}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      €{plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">/mo</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-1 text-primary-500" size={16} />
                      <span className="text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={isLoading || isCurrentPlan}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                    isCurrentPlan
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-default'
                      : plan.highlighted
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600'
                      : 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50'
                  }`}
                >
                  {isCurrentPlan
                    ? t('subscription.pricing.currentPlan')
                    : isLoading
                    ? t('common.loading')
                    : t('subscription.pricing.subscribe')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}