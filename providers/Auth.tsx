import { useRouter, useSegments } from 'expo-router';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DEMO_GUEST_USER, isDemoMode } from '@/constants';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
  setUnauthorizedHandler,
} from '@/services/api';
import * as authApi from '@/services/authApi';
import type { UserProfile } from '@/types/api';

interface AuthContextProps {
  user: UserProfile | null;
  token: string | null;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  setQuizStreak: (quizStreak: number, completedToday?: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const guestProfile = (): UserProfile => ({ ...DEMO_GUEST_USER });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(
    isDemoMode ? guestProfile() : null,
  );
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  const logout = useCallback(async () => {
    if (isDemoMode) {
      setToken(null);
      setUser(guestProfile());
      return;
    }
    await clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (isDemoMode) {
      const guest = guestProfile();
      setUser(guest);
      return guest;
    }

    try {
      const profile = await authApi.getMe();
      setUser(profile);
      return profile;
    } catch {
      await logout();
      return null;
    }
  }, [logout]);

  const login = useCallback(async (username: string, password: string) => {
    if (isDemoMode) {
      setUser(guestProfile());
      return;
    }

    const { token: nextToken } = await authApi.login(username, password);
    await setStoredToken(nextToken);
    setToken(nextToken);
    const profile = await authApi.getMe(nextToken);
    setUser(profile);
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    if (isDemoMode) {
      setUser(guestProfile());
      return;
    }

    await authApi.register(username, password);
    const { token: nextToken } = await authApi.login(username, password);
    await setStoredToken(nextToken);
    setToken(nextToken);
    const profile = await authApi.getMe(nextToken);
    setUser(profile);
  }, []);

  const setQuizStreak = useCallback(
    (quizStreak: number, completedToday = true) => {
      if (isDemoMode) {
        return;
      }
      setUser((prev) =>
        prev
          ? {
              ...prev,
              quizStreak,
              completedToday,
            }
          : prev,
      );
    },
    [],
  );

  useEffect(() => {
    if (isDemoMode) {
      return;
    }

    setUnauthorizedHandler(() => {
      void logout();
    });
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (isDemoMode) {
        if (!cancelled) {
          setUser(guestProfile());
          setToken(null);
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const stored = await getStoredToken();
        if (!stored) {
          if (!cancelled) {
            setIsBootstrapping(false);
          }
          return;
        }

        setToken(stored);
        const profile = await authApi.getMe(stored);
        if (!cancelled) {
          setUser(profile);
        }
      } catch {
        await clearStoredToken();
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    const onLoginScreen = segments[0] === 'login';

    if (isDemoMode) {
      if (onLoginScreen) {
        router.replace('/');
      }
      return;
    }

    if (!token && !onLoginScreen) {
      router.replace('/login');
    } else if (token && onLoginScreen) {
      router.replace('/');
    }
  }, [isBootstrapping, token, segments, router]);

  const value = useMemo(
    () => ({
      user,
      token,
      isBootstrapping,
      isAuthenticated: isDemoMode ? Boolean(user) : Boolean(token && user),
      login,
      register,
      logout,
      refreshProfile,
      setQuizStreak,
    }),
    [
      user,
      token,
      isBootstrapping,
      login,
      register,
      logout,
      refreshProfile,
      setQuizStreak,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
