import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileText, MessageSquare, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ConfirmModal from './ConfirmModal';
import { deleteDocument, docId } from '../api/documents';
import getErrorMessage from '../utils/getErrorMessage';
import timeAgo from '../utils/timeAgo';

export default function DocumentCard({ doc, onDeleted }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const id = docId(doc);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDocument(id);
      toast.success('Document deleted');
      setConfirmOpen(false);
      await onDeleted();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-300">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{doc.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <StatusBadge status={doc.status} />
            {doc.charCount != null && <span>{doc.charCount.toLocaleString()} chars</span>}
            {doc.createdAt && <span>{timeAgo(doc.createdAt)}</span>}
          </div>
          {doc.status === 'failed' && (
            <p className="mt-1 text-xs text-red-300">Processing failed. Delete it and try uploading again.</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        {doc.status === 'ready' && (
          <Link
            to={`/documents/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Link>
        )}
        <button
          onClick={() => setConfirmOpen(true)}
          aria-label={`Delete ${doc.title}`}
          title="Delete"
          className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ConfirmModal
        open={confirmOpen}
        danger
        loading={deleting}
        title="Delete this document?"
        message={`"${doc.title}" and its chat history will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </li>
  );
}