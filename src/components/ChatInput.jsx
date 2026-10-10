import { SendHorizontal } from 'lucide-react';

export default function ChatInput({ value, onChange, onSend, disabled }) {
  const handleKeyDown = (e) => {
    // Enter sends, Shift+Enter inserts a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={1000}
        placeholder="Ask a question about this document..."
        className="max-h-40 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        aria-label="Send"
        className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
}