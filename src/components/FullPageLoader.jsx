import { useEffect, useState } from 'react';

export default function FullPageLoader() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900 text-slate-200">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-indigo-400" />
      {slow && (
        <p className="text-sm text-slate-400 text-center px-6">
          Waking up the server (free hosting sleeps when idle). This can take up to a minute...
        </p>
      )}
    </div>
  );
}