import { useContext } from 'react';
import { AuthContext } from '../context/authContextObject';

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}