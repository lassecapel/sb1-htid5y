import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
      <WifiOff size={20} />
      <span className="font-medium">You're offline</span>
    </div>
  );
}