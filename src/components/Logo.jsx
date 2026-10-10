import { FileSearch } from 'lucide-react';

export default function Logo({ large = false }) {
  return (
    <span className="inline-flex items-center gap-2 font-bold text-white">
      <span className="grid place-items-center rounded-lg bg-indigo-600 p-1.5">
        <FileSearch className="h-4 w-4" />
      </span>
      <span className={large ? 'text-2xl' : 'text-xl'}>
        Doc<span className="text-indigo-400">Mind</span>
      </span>
    </span>
  );
}