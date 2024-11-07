import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useGuestStore } from './guestStore';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,

  initialize: async () => {
    try {
      // Get session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      set({ 
        user: session?.user || null,
        initialized: true, 
        loading: false 
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null });
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Authentication failed',
        loading: false,
        initialized: true
      });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      set({ user: data.user, loading: false });
      useGuestStore.getState().clearAll();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign in failed',
        loading: false 
      });
      throw error;
    }
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/app'
        }
      });

      if (error) throw error;
      set({ user: data.user, loading: false });
      useGuestStore.getState().clearAll();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign up failed',
        loading: false 
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
      useGuestStore.getState().clearAll();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Sign out failed',
        loading: false 
      });
      throw error;
    }
  },

  continueAsGuest: () => {
    set({ 
      user: { 
        id: `guest-${Date.now()}`,
        email: 'guest@example.com',
        role: 'guest',
        aud: 'guest',
        created_at: new Date().toISOString(),
      } as User,
      loading: false 
    });
  }
}));