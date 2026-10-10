import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bot, FileText, Sparkles } from 'lucide-react';
import { getDocument } from '../api/documents';
import { askQuestion, getHistory } from '../api/chat';
import normalizeHistory from '../utils/normalizeHistory';
import getErrorMessage from '../utils/getErrorMessage';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import FullPageLoader from '../components/FullPageLoader';

const SUGGESTIONS = [
  'Summarize this document in a few sentences',
  'What are the key points?',
  'List any important dates, names or numbers',
];

export default function Chat() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [d, history] = await Promise.all([getDocument(id), getHistory(id)]);
        if (cancelled) return;
        setDoc(d);
        setMessages(normalizeHistory(history));
      } catch (err) {
        if (!cancelled) setLoadError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // textOverride lets the suggestion chips send a question directly
  const handleSend = async (textOverride) => {
    const question = (textOverride ?? draft).trim();
    if (!question || sending) return;

    setSendError('');
    setDraft('');
    setSending(true);
    setMessages((m) => [...m, { id: `tmp-${Date.now()}`, role: 'user', content: question }]);

    try {
      const data = await askQuestion(id, question);
      setMessages((m) => [
        ...m,
        { id: data.messageId ?? `a-${Date.now()}`, role: 'assistant', content: data.answer, sources: data.sources ?? [] },
      ]);
    } catch (err) {
      setSendError(getErrorMessage(err));
      setMessages((m) => m.slice(0, -1));
      setDraft(question);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <FullPageLoader />;

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center text-slate-200">
        <p className="text-red-300">{loadError}</p>
        <Link to="/" className="text-indigo-400 hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const notReady = doc && doc.status !== 'ready';

  return (
    <div className="flex h-dvh flex-col bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link
            to="/"
            aria-label="Back to dashboard"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <FileText className="h-5 w-5 shrink-0 text-indigo-300" />
          <h1 className="truncate font-semibold text-white">{doc?.title}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && !notReady && (
            <div className="flex animate-fade-in flex-col items-center gap-4 py-12 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-500/15 text-indigo-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-slate-400">
                Ask anything about this document. Answers are grounded in its content.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={sending}
                    className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-sm text-slate-300 hover:border-indigo-500 hover:text-white disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => <MessageBubble key={m.id} message={m} />)}

          {sending && (
            <div className="flex items-end gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-700">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-700 bg-slate-800 px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="border-t border-slate-800 px-4 py-3">
        <div className="mx-auto max-w-3xl space-y-2">
          {notReady && (
            <p className="text-sm text-amber-300">
              This document is {doc.status}. Chat is available once it is ready.
            </p>
          )}
          {sendError && <p role="alert" className="text-sm text-red-300">{sendError}</p>}
          <ChatInput
            value={draft}
            onChange={setDraft}
            onSend={() => handleSend()}
            disabled={sending || notReady}
          />
        </div>
      </footer>
    </div>
  );
}