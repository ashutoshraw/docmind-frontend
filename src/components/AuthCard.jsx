import { FileSearch, ShieldCheck, Zap } from 'lucide-react';
import Logo from './Logo';

const FEATURES = [
  { Icon: FileSearch, text: 'Ask questions about your documents in plain English' },
  { Icon: ShieldCheck, text: 'Answers grounded in your content, with cited sources' },
  { Icon: Zap, text: 'Semantic search powered by vector embeddings' },
];

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-center gap-10 overflow-hidden border-r border-slate-800 bg-linear-to-br from-indigo-600/25 via-slate-900 to-slate-950 p-12 lg:flex">
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative">
          <Logo large />
          <h2 className="mt-8 max-w-md text-4xl font-bold leading-tight text-white">
            Chat with any document. Get answers you can verify.
          </h2>
        </div>
        <ul className="relative space-y-4">
          {FEATURES.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-slate-300">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-500/15 text-indigo-300">
                <Icon className="h-5 w-5" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo large /></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="mb-6 mt-1 text-slate-400">{subtitle}</p>
            {children}
          </div>
          <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
        </div>
      </main>
    </div>
  );
}