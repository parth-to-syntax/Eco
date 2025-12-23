import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '@/api/client';

const AuthContext = createContext(undefined);

// Exporting function declaration helps React Fast Refresh keep a stable boundary
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastError, setLastError] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const lastActionRef = React.useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('ecofinds-auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token) {
          setAuthToken(parsed.token);
          setToken(parsed.token);
        }
        if (parsed.user) setUser(parsed.user);
      } catch (e) {
        console.warn('[AUTH_INIT_PARSE_ERROR]', e);
      }
    }
    // Only call /me if we have a token or we rely on cookie presence (best effort)
    if (stored || document.cookie.includes('token=')) {
      api.get('/api/auth/me')
        .then(r => {
          setUser(r.data.user);
        })
        .catch(err => {
          console.debug('[AUTH_ME_FAIL]', err?.response?.status, err?.response?.data);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      lastActionRef.current = 'login';
      const res = await api.post('/api/auth/login', { email, password });
      const { user: u, token: t } = res.data;
      setUser(u);
      setToken(t);
      setAuthToken(t); // set bearer for axios
      localStorage.setItem('ecofinds-auth', JSON.stringify({ user: u, token: t }));
      return true;
    } catch (e) {
      setLastError(e?.response?.data?.message || e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name, avatar) => {
    setIsLoading(true);
    try {
      lastActionRef.current = 'register';
      const res = await api.post('/api/auth/register', { email, password, name, avatar });
      const { user: u, token: t } = res.data;
      setUser(u);
      setToken(t);
      setAuthToken(t);
      localStorage.setItem('ecofinds-auth', JSON.stringify({ user: u, token: t }));
      return true;
    } catch (e) {
      setLastError(e?.response?.data?.message || e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    lastActionRef.current = 'logout';
    try { await api.post('/api/auth/logout'); } catch (e) { setLastError(e?.message); }
    setUser(null);
    setToken(null);
    setAuthToken(undefined);
    localStorage.removeItem('ecofinds-auth');
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    try {
      lastActionRef.current = 'updateProfile';
      const res = await api.put(`/api/users/${user.id}`, updates);
      const updatedUser = res.data.user || { ...user, ...updates };
      setUser(updatedUser);
      const stored = JSON.parse(localStorage.getItem('ecofinds-auth') || '{}');
      localStorage.setItem('ecofinds-auth', JSON.stringify({ ...stored, user: updatedUser }));
    } catch (e) {
      setLastError(e?.response?.data?.message || e.message);
    }
  };

  useEffect(() => {
    setLastAction(lastActionRef.current);
  }, [user, token, lastError]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateProfile,
      isLoading,
  lastError,
      debug: (import.meta.env.VITE_DEBUG === '1') ? {
        token,
        lastError,
        lastAction,
        requestLog: window.__AXIOS_LOG__ || []
      } : undefined
    }}>
      {children}
    </AuthContext.Provider>
  );
};