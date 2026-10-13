import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Logo from '../components/Logo';

export default function Landing() {
  const { loginAsGuest } = useAuth();
  const [starting, setStarting] = useState(false);

  const handleTry = async () => {
    setStarting(true);
    try {
      await loginAsGuest(); // on success the app switches to the dashboard
    } catch {
      toast.error('Could not start the demo. If the server was idle, wait a minute and try again.');
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Logo />
        <div className="flex items-center gap-3 text-sm">
          <Link to="/login" className="text-slate-300 hover:text-white">
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg border border-slate-700 px-3 py-1.5 hover:bg-slate-800"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Ask questions. Get answers from your documents.
        </h1>
        <p className="mt-5 text-lg text-slate-400">
          Upload a PDF or text file and chat with it. Every answer shows the exact
          passages it came from.
        </p>
        <button
          onClick={handleTry}
          disabled={starting}
          className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {starting ? 'Setting up your demo...' : 'Try it now'}
        </button>
        <p className="mt-3 text-sm text-slate-500">
          No sign-up needed. Demo data is deleted after 24 hours.
        </p>
      </main>
    </div>
  );
}