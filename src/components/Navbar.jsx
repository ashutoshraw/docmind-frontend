import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const initial = user?.name?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/"><Logo /></Link>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 font-semibold text-white">
              {initial}
            </span>
            <span className="hidden max-w-40 truncate text-slate-300 sm:inline">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            title="Log out"
            aria-label="Log out"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}