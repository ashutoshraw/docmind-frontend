import { CheckCircle2, Library, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';
import DocumentCard from '../components/DocumentCard';
import useDocuments from '../hooks/useDocuments';
import useAuth from '../hooks/useAuth';
import { docId } from '../api/documents';

function Stat({ label, value, Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-500/10 text-indigo-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none text-white">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { documents, loading, error, refresh } = useDocuments();

  const ready = documents.filter((d) => d.status === 'ready').length;
  const processing = documents.filter((d) => d.status === 'processing').length;
  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {firstName}</h1>
          <p className="text-slate-400">Upload a document and start asking it questions.</p>
        </div>

        {!loading && (
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Documents" value={documents.length} Icon={Library} />
            <Stat label="Ready" value={ready} Icon={CheckCircle2} />
            <Stat label="Processing" value={processing} Icon={Loader2} />
          </div>
        )}

        <UploadForm onUploaded={refresh} />

        <section>
          <h2 className="mb-3 text-lg font-semibold text-white">Your documents</h2>

          {error && (
            <div role="alert" className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}{' '}
              <button onClick={refresh} className="underline">Retry</button>
            </div>
          )}

          {loading ? (
            <ul className="space-y-3" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <li key={i} className="h-[76px] animate-pulse rounded-xl border border-slate-800 bg-slate-900/60" />
              ))}
            </ul>
          ) : documents.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              No documents yet. Upload a file or paste some text to get started.
            </p>
          ) : (
            <ul className="space-y-3">
              {documents.map((d) => (
                <DocumentCard key={docId(d)} doc={d} onDeleted={refresh} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}