import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';

export function ThemeToggle() {
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className="relative inline-flex h-12 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
      aria-pressed={isDark}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={`absolute left-1 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-lg transform transition-transform duration-300 ${
          isDark ? 'translate-x-12' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon size={18} className="text-primary-500" />
        ) : (
          <Sun size={18} className="text-primary-500" />
        )}
      </span>
    </button>
  );
}