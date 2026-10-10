import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import FullPageLoader from './FullPageLoader';

// Only logged-in users get through
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

// Login/signup pages: logged-in users get bounced to the dashboard
export function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;
  if (user) return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  return <Outlet />;
}