import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import SourceChips from './SourceChips';

// Styles for Markdown elements inside answers. The `node` prop that
// react-markdown passes is dropped so it never reaches the DOM.
/* eslint-disable no-unused-vars */
const el = (Tag, className) =>
  function Styled({ node, ...props }) {
    return <Tag className={className} {...props} />;
  };
/* eslint-enable no-unused-vars */

const markdownComponents = {
  p: el('p', 'mb-2 last:mb-0'),
  ul: el('ul', 'mb-2 list-disc space-y-1 pl-5 last:mb-0'),
  ol: el('ol', 'mb-2 list-decimal space-y-1 pl-5 last:mb-0'),
  strong: el('strong', 'font-semibold text-white'),
  a: el('a', 'text-indigo-300 underline'),
  h1: el('h3', 'mb-2 font-semibold text-white'),
  h2: el('h3', 'mb-2 font-semibold text-white'),
  h3: el('h3', 'mb-2 font-semibold text-white'),
};

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
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="break-words">
            <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
          </div>
        )}
        {!isUser && <SourceChips sources={message.sources} />}
      </div>
    </div>
  );
}