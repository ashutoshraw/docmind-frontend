import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { docId, listDocuments } from '../api/documents';
import getErrorMessage from '../utils/getErrorMessage';

const POLL_MS = 3000;

export default function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const prevStatuses = useRef(null);

  const refresh = useCallback(async () => {
    try {
      setDocuments(await listDocuments());
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const docs = await listDocuments();
        if (!cancelled) setDocuments(docs);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Toast when a document moves from processing to ready/failed
  useEffect(() => {
    const prev = prevStatuses.current;
    if (prev) {
      documents.forEach((d) => {
        if (prev[docId(d)] !== 'processing') return;
        if (d.status === 'ready') toast.success(`"${d.title}" is ready to chat`);
        if (d.status === 'failed') toast.error(`"${d.title}" failed to process`);
      });
    }
    prevStatuses.current = Object.fromEntries(documents.map((d) => [docId(d), d.status]));
  }, [documents]);

  const hasProcessing = documents.some((d) => d.status === 'processing');

  useEffect(() => {
    if (!hasProcessing) return;
    const timer = setInterval(() => {
      if (!document.hidden) refresh();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [hasProcessing, refresh]);

  return { documents, loading, error, refresh };
}