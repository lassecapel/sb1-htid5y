import React from 'react';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  onAuthRequired: () => void;
}

export function EmptyState({ onAuthRequired }: EmptyStateProps) {
  const { t } = useTranslation();
  const { continueAsGuest } = useAuthStore();
  const navigate = useNavigate();

  const handleGuestAccess = () => {
    continueAsGuest();
    // Navigate to app route instead of dashboard
    navigate('/app');
  };

  return (
    <div className="text-center max-w-md mx-auto bg-white/90 backdrop-blur rounded-bubble p-8 shadow-xl">
      <BookOpen className="mx-auto text-primary-500 mb-4" size={48} />
      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text mb-4">
        {t('dashboard.empty.title', 'Welcome to Wordzy')}
      </h2>
      <p className="text-gray-600 text-lg mb-8">
        {t('dashboard.empty.subtitle', 'Sign in or continue as guest to start learning new languages.')}
      </p>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={onAuthRequired}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-colors"
        >
          <LogIn size={20} />
          {t('auth.signIn')}
        </button>
        
        <button
          onClick={handleGuestAccess}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-600 rounded-xl font-medium hover:bg-primary-50 transition-colors"
        >
          <UserPlus size={20} />
          {t('auth.continueAsGuest')}
        </button>
      </div>
    </div>
  );
}