import React, { useState } from 'react';
import { X, UserPlus, Mail, LogIn } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signIn, signUp, continueAsGuest } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (isLogin) {
        await signIn(email, password);
        onClose();
        navigate('/app');
      } else {
        await signUp(email, password);
        setSuccess(t('auth.verificationEmailSent'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.error'));
    }
  };

  const handleGuestAccess = () => {
    continueAsGuest();
    onClose();
    navigate('/app');
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-primary-500 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-300 rounded-xl text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('auth.email')}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-400 dark:focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-primary-400 dark:focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-colors"
          >
            {isLogin ? t('auth.signIn') : t('auth.signUp')}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                {t('auth.or')}
              </span>
            </div>
          </div>

          <button
            onClick={handleGuestAccess}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <UserPlus size={20} />
            {t('auth.continueAsGuest')}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              {isLogin ? t('auth.signUp') : t('auth.signIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}