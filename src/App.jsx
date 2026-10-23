import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import useAuth from './hooks/useAuth';
import FullPageLoader from './components/FullPageLoader';
import Chat from './pages/Chat';
// "/" shows the dashboard to logged-in users and the landing page to everyone else.
function Home() {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  return user ? <Dashboard /> : <Landing />;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' },
        }}
      />
      <Routes>
                <Route path="/" element={<Home />} />
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/documents/:id" element={<Chat />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}