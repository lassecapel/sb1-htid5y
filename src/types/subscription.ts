export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionFeature {
  id: string;
  tier: SubscriptionTier;
  feature: string;
  limit: number | null;
}

export interface PricingPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  features: string[];
  highlighted?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    tier: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Basic flashcard practice',
      'Up to 10 word lists',
      'Basic progress tracking',
      'Community support'
    ]
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: 2,
    highlighted: true,
    features: [
      'All Free features',
      'Advanced practice modes',
      'Unlimited word lists',
      'Detailed analytics',
      'Email support'
    ]
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: 5,
    features: [
      'All Premium features',
      'AI-powered sentence generation',
      'Export/import functionality',
      'Priority support',
      'Early access to new features'
    ]
  }
];