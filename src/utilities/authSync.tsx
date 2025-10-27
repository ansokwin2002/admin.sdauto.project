"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthSync() {
  const router = useRouter();

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (!e) return;
      // If logout broadcast received from another tab
      if (e.key === 'logout_broadcast') {
        try { localStorage.removeItem('auth_token'); } catch {}
        router.push('/login');
      }
      // If auth_token removed or changed to empty in another tab
      if (e.key === 'auth_token' && (e.newValue === null || e.newValue === '')) {
        router.push('/login');
      }
      // Optional: if login broadcast happens, you can refresh or navigate
      // if (e.key === 'login_broadcast') { router.refresh(); }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [router]);
}
