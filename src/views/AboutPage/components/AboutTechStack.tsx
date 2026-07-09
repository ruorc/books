import { useId, type ReactNode } from 'react';
import { Cpu } from 'lucide-react';

const TECH_STACK = [
  {
    name: 'React 19',
    className: 'border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    name: 'TypeScript',
    className:
      'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Vite',
    className:
      'border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    name: 'Tailwind CSS v4',
    className:
      'border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400',
  },
  {
    name: 'React Router v7',
    className: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
  },
  {
    name: 'Framer Motion',
    className:
      'border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
  },
  {
    name: 'Lucide Icons',
    className:
      'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
] as const;

/**
 * Presentation layout view displaying the foundational engineering stack.
 * Renders a responsive wrapped grid matrix of verified framework badges.
 */
export function AboutTechStack(): ReactNode {
  const headingId = useId();

  return (
    <section className="space-y-4" aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-200"
      >
        <Cpu aria-hidden="true" className="h-5 w-5 text-indigo-500" />
        <span>Technology Stack</span>
      </h2>

      <div className="flex flex-wrap gap-2.5">
        {TECH_STACK.map((tech) => (
          <span
            key={tech.name}
            className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${tech.className}`}
          >
            {tech.name}
          </span>
        ))}
      </div>
    </section>
  );
}
