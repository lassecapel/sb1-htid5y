import React, { useState } from 'react';
import { Sparkles, Star, Moon, LogIn, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { useThemeStore } from '../stores/themeStore';

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const { user, signOut } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isDark = useThemeStore((state) => state.isDark);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg rounded-b-3xl mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <Star className="text-primary-400 animate-float" size={32} />
              <Moon className="absolute -top-1 -right-1 text-secondary-400" size={16} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
              Wordzy
            </h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <LanguageSelector />
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <User size={20} className="text-primary-500" />
                  <span>{user.email}</span>
                  <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg py-2 border border-gray-100 dark:border-gray-800 z-50">
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      {t('settings.title')}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
                    >
                      <LogOut size={16} />
                      {t('auth.signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-colors"
              >
                <LogIn size={16} />
                {t('auth.signIn')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}