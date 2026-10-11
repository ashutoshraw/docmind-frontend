import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, Loader2, UploadCloud, X } from 'lucide-react';
import { uploadFile, uploadText } from '../api/documents';
import getErrorMessage from '../utils/getErrorMessage';

const MAX_MB = 10; // keep in sync with your multer limit
const ALLOWED = ['pdf', 'txt', 'md']; // keep in sync with your multer fileFilter
const MAX_TITLE = 100; // keep in sync with the backend

// If the title is left blank, name the document after its first line
const autoTitle = (text) => {
  const firstLine = text.trim().split('\n')[0].trim();
  if (!firstLine) return 'Untitled document';
  return firstLine.length > 60 ? `${firstLine.slice(0, 60)}...` : firstLine;
};

export default function UploadForm({ onUploaded }) {
  const [mode, setMode] = useState('file');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const pickFile = (f) => {
    setError('');
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      setError(`Unsupported file type. Allowed: ${ALLOWED.join(', ')}`);
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large. Max ${MAX_MB} MB.`);
      return;
    }
    setFile(f);
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'file' && !file) return setError('Choose a file first.');
    if (mode === 'text' && !text.trim()) return setError('Paste some text first.');

    setSubmitting(true);
    try {
      if (mode === 'file') await uploadFile(file);
      else await uploadText(title.trim() || autoTitle(text), text.trim());

      clearFile();
      setTitle('');
      setText('');
      await onUploaded();
      toast.success('Upload received. Processing started...');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const tab = (value, label) => (
    <button
      type="button"
      onClick={() => { setMode(value); setError(''); }}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        mode === value ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="mb-4 flex gap-2">
        {tab('file', 'Upload file')}
        {tab('text', 'Paste text')}
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {mode === 'file' ? (
        file ? (
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-6 w-6 shrink-0 text-indigo-300" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <button type="button" onClick={clearFile} aria-label="Remove file" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
              dragging ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500'
            }`}
          >
            <UploadCloud className="h-8 w-8 text-indigo-300" />
            <p className="text-sm text-slate-200">
              <span className="font-medium text-indigo-300">Click to browse</span> or drag a file here
            </p>
            <p className="text-xs text-slate-500">
              {ALLOWED.join(', ').toUpperCase()} up to {MAX_MB} MB
            </p>
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED.map((x) => `.${x}`).join(',')}
              onChange={(e) => pickFile(e.target.files[0])}
              className="sr-only"
            />
          </label>
        )
      ) : (
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            maxLength={MAX_TITLE}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your document text here..."
            rows={6}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}