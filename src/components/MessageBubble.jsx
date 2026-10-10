import { Bot, User } from 'lucide-react';
import SourceChips from './SourceChips';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex animate-fade-in items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isUser ? 'bg-indigo-600' : 'bg-slate-700'}`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 sm:max-w-[75%] ${
          isUser
            ? 'rounded-br-sm bg-indigo-600 text-white'
            : 'rounded-bl-sm border border-slate-700 bg-slate-800 text-slate-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {!isUser && <SourceChips sources={message.sources} />}
      </div>
    </div>
  );
}