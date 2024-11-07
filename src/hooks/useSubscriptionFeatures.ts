import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import type { SubscriptionFeature } from '../types/subscription';

export function useSubscriptionFeatures() {
  const { currentSubscription } = useSubscriptionStore();
  const [features, setFeatures] = useState<SubscriptionFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const { data, error } = await supabase
          .from('subscription_features')
          .select('*')
          .eq('tier', currentSubscription?.tier || 'free');

        if (error) throw error;
        setFeatures(data);
      } catch (error) {
        console.error('Failed to fetch subscription features:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatures();
  }, [currentSubscription]);

  const checkFeatureAccess = (feature: string): boolean => {
    const featureData = features.find(f => f.feature === feature);
    return !!featureData;
  };

  const getFeatureLimit = (feature: string): number | null => {
    const featureData = features.find(f => f.feature === feature);
    return featureData?.limit ?? null;
  };

  return {
    features,
    loading,
    checkFeatureAccess,
    getFeatureLimit
  };
}