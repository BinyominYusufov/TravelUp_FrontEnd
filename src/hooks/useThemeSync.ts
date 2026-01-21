import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to synchronize theme from user profile with next-themes
 * This ensures that when a user logs in, their saved theme preference is applied
 */
export const useThemeSync = () => {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.theme) {
      // Sync theme from user profile when user is authenticated
      if (user.theme === 'dark' || user.theme === 'light') {
        // Only update if different to avoid unnecessary re-renders
        if (theme !== user.theme && theme !== 'system') {
          setTheme(user.theme);
        }
      }
    }
  }, [user?.theme, isAuthenticated, theme, setTheme]);

  return { theme, setTheme };
};
