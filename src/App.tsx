import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Practice } from './components/practice/Practice';
import { EditWordListPage } from './components/wordList/EditWordListPage';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { ConfigurationScreen } from './components/settings/ConfigurationScreen';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { useConfigStore } from './stores/configStore';
import { initDB } from './lib/db';
import { syncPendingData } from './lib/syncManager';
import { useOnlineStatus } from './hooks/useOnlineStatus';

export default function App() {
  const { user, loading, initialized, initialize } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const isDark = useThemeStore((state) => state.isDark);
  const colorScheme = useConfigStore((state) => state.colorScheme);
  const isOnline = useOnlineStatus();
  const [dbInitialized, setDbInitialized] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      if (!initialized) {
        await initialize();
        await initDB();
        setDbInitialized(true);
      }
    }
    init();
  }, [initialize, initialized]);

  React.useEffect(() => {
    if (isOnline && dbInitialized) {
      syncPendingData();
    }
  }, [isOnline, dbInitialized]);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
  }, [colorScheme]);

  if (!initialized || loading || !dbInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200`}>
        {/* Show header on all routes except landing page */}
        <Routes>
          <Route path="/" element={null} />
          <Route path="*" element={user && <Header onAuthClick={() => setShowAuth(true)} />} />
        </Routes>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/app" /> : <LandingPage />} />
            <Route path="/app" element={<Dashboard />} />
            <Route path="/practice/:listId/:type" element={
              user ? <Practice /> : <Navigate to="/app" />
            } />
            <Route path="/wordlist/:id/edit" element={
              user ? <EditWordListPage /> : <Navigate to="/app" />
            } />
            <Route path="/settings" element={
              user ? <ConfigurationScreen /> : <Navigate to="/app" />
            } />
          </Routes>
        </main>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        <OfflineIndicator />
      </div>
    </BrowserRouter>
  );
}