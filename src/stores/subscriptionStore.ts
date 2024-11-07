import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Subscription, SubscriptionTier } from '../types/subscription';

interface SubscriptionState {
  currentSubscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  fetchSubscription: (userId: string) => Promise<void>;
  subscribe: (tier: SubscriptionTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  currentSubscription: null,
  isLoading: false,
  error: null,

  fetchSubscription: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      set({ currentSubscription: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch subscription' });
    } finally {
      set({ isLoading: false });
    }
  },

  subscribe: async (tier: SubscriptionTier) => {
    set({ isLoading: true, error: null });
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert([{
          tier,
          status: 'active',
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          cancel_at_period_end: false
        }])
        .select()
        .single();

      if (error) throw error;
      set({ currentSubscription: subscription });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to process subscription' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const { currentSubscription } = get();
      if (!currentSubscription) throw new Error('No active subscription');

      const { error } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: true,
          status: 'canceled'
        })
        .eq('id', currentSubscription.id);

      if (error) throw error;
      set({ currentSubscription: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to cancel subscription' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));