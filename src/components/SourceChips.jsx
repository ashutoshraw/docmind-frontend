import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SourceChips({ sources }) {
  const [open, setOpen] = useState(false);
  if (!sources?.length) return null;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
      >
        Sources ({sources.length})
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-2 flex flex-wrap gap-2">
          {sources.map((s) => (
            <span
              key={s.chunkIndex}
              title="Document chunk used to answer, with cosine similarity score"
              className="rounded-full border border-slate-600 bg-slate-900 px-2 py-0.5 text-xs text-slate-300"
            >
              Chunk {s.chunkIndex}
              {s.score != null && ` · ${Number(s.score).toFixed(2)}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}