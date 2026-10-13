import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthContext } from './authContextObject';
import axios from 'axios';
import api, { setAccessToken, setAuthFailureHandler } from '../api/client';


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we try to restore the session
  const didRestore = useRef(false);

  // Session restore: access token is lost on reload, so use the refresh cookie to get a new one
  useEffect(() => {
    if (didRestore.current) return; // StrictMode runs effects twice in dev; only restore once
    didRestore.current = true;

    (async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          null,
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
        const me = await api.get('/auth/me');
        setUser(me.data.user ?? me.data);
      } catch {
        setAccessToken(null); // not logged in, which is a normal outcome
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // If a mid-session refresh fails (cookie expired), the interceptor calls this
  useEffect(() => {
    setAuthFailureHandler(() => setUser(null));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

    // "Try it now": creates a temporary guest account on the backend.
  const loginAsGuest = useCallback(async () => {
    const { data } = await api.post('/auth/guest');
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  // Turns the current guest into a real account; documents stay attached.
  const upgradeGuest = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/upgrade', { name, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null); // clear locally even if the request fails
      setUser(null);
    }
  }, []);

  return (
        <AuthContext.Provider
      value={{ user, loading, login, signup, loginAsGuest, upgradeGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}