import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Logo from '../components/Logo';
import {
  SiReact,
  SiVite,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGooglegemini,
  SiJsonwebtokens,
} from 'react-icons/si';
import { Search,Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const TECH = [
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Vite', Icon: SiVite, color: '#646CFF' },
  { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'Express', Icon: SiExpress, color: '#E2E8F0' },
  { name: 'MongoDB Atlas', Icon: SiMongodb, color: '#47A248' },
  { name: 'Atlas Vector Search', Icon: Search, color: '#34D399' },
  { name: 'Google Gemini', Icon: SiGooglegemini, color: '#8E75B2' },
  { name: 'JWT', Icon: SiJsonwebtokens, color: '#D63AFF' },
];

// Fill these in before pushing.
const GITHUB_URL = 'https://github.com/ashutoshraw';
const LINKEDIN_URL = 'https://www.linkedin.com/in/ashutosh-rawat-032ab4263';
const EMAIL = 'ashutoshrawat301@gmail.com';

export default function Landing() {
  const { loginAsGuest } = useAuth();
  const [starting, setStarting] = useState(false);

  const handleTry = async () => {
    setStarting(true);
    try {
      await loginAsGuest(); // on success the app switches to the dashboard
    } catch {
      toast.error('Could not start the demo. If the server was idle, wait a minute and try again.');
      setStarting(false);
    }
  };

  return (
       <div id="top" className="min-h-screen bg-slate-950 text-slate-200">
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <a href="#top"><Logo /></a>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#top" className="hover:text-white">Home</a>
            <a href="#how-it-works" className="hover:text-white">How it works</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <a
              href="https://github.com/ashutoshraw/docmind-frontend"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            <Link to="/login" className="text-slate-300 hover:text-white">
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-500"
            >
              Sign up
            </Link>
          </div>
        </div>
                <nav className="flex gap-5 overflow-x-auto border-t border-slate-800 px-4 py-2 text-sm text-slate-300 md:hidden">
          <a href="#top" className="shrink-0 hover:text-white">Home</a>
          <a href="#how-it-works" className="shrink-0 hover:text-white">How it works</a>
          <a href="#about" className="shrink-0 hover:text-white">About</a>
          <a href="#contact" className="shrink-0 hover:text-white">Contact</a>
          <a
            href="https://github.com/ashutoshraw/docmind-frontend"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 hover:text-white"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Ask questions. Get answers from your documents.
        </h1>
        <p className="mt-5 text-lg text-slate-400">
          Upload a PDF or text file and chat with it. Every answer shows the exact
          passages it came from.
        </p>
        <button
          onClick={handleTry}
          disabled={starting}
          className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {starting ? 'Setting up your demo...' : 'Try it now'}
        </button>
        <p className="mt-3 text-sm text-slate-500">
          No sign-up needed. Demo data is deleted after 24 hours.
        </p>
      </main>
            <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-white">How it works</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          DocMind uses retrieval-augmented generation (RAG): it finds the passages
          that matter first, then asks the AI to answer using only those.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Upload',
              text: 'Add a PDF, a text file, or pasted text. It is split into overlapping chunks and each chunk is turned into an embedding that captures its meaning.',
            },
            {
              step: '2',
              title: 'Search',
              text: 'When you ask a question, it is embedded the same way. Atlas Vector Search finds the chunks of your document closest in meaning to it.',
            },
            {
              step: '3',
              title: 'Answer with sources',
              text: 'Gemini answers using only those chunks, and the answer shows the passages it used, so you can check it. If the answer is not in the document, it says so.',
            },
          ].map((s) => (
                   <div
              key={s.step}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-indigo-500/50"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {s.step}
                </span>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
            <section id="about" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">About DocMind</h2>
        <p className="mt-4 text-slate-400">
          DocMind is a full-stack project I built to learn how retrieval-augmented
          generation works end to end: ingestion, embeddings, vector search,
          grounded answers, authentication and deployment.
        </p>

                <div className="mt-8 flex flex-wrap justify-center gap-2">
          {TECH.map(({ name, Icon, color }) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1.5 text-sm text-slate-300"
            >
              <Icon className="h-4 w-4" style={{ color }} />
              {name}
            </span>
          ))}
        </div>

        <p className="mt-6 text-sm text-slate-500">Built by Ashutosh Singh.</p>
      </section>
            <section id="contact" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">Contact</h2>
        <p className="mt-3 text-slate-400">
          Feedback, questions or opportunities? Reach me here.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            <FaGithub className="h-4 w-4" /> GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            <FaLinkedin className="h-4 w-4 text-sky-400" /> LinkedIn
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            <Mail className="h-4 w-4 text-indigo-400" /> Email
          </a>
        </div>
      </section>
    </div>
  );
}