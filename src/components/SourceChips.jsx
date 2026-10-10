export default function SourceChips({ sources }) {
  if (!sources?.length) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span className="text-xs text-slate-400">Sources:</span>
      {sources.map((s) => (
        <span
          key={s.chunkIndex}
          title="Document chunk used to answer, with cosine similarity score"
          className="rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
        >
         Chunk {s.chunkIndex}{s.score != null && ` · ${Number(s.score).toFixed(2)}`}
        </span>
      ))}
    </div>
  );
}