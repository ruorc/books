import { Cpu } from 'lucide-react';

// Static declarative representation of the project's ecosystem
const TECH_STACK = [
  {
    name: 'React 19',
    className: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  },
  {
    name: 'TypeScript',
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    name: 'Vite',
    className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  {
    name: 'Tailwind CSS v4',
    className: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  },
  {
    name: 'React Router v7',
    className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
  {
    name: 'Framer Motion', // Newly added package responsible for smooth UI interactions
    className: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20',
  },
  {
    name: 'Lucide Icons',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
] as const;


export function AboutTechStack() {
  return (
    <section className="space-y-4">
      {/* Section Title with dynamic engine icon */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Cpu className="h-5 w-5 text-indigo-500" />
        Technology Stack
      </h2>
      
      {/* Responsive wrapped grid of technology badges */}
      <div className="flex flex-wrap gap-2.5">
        {TECH_STACK.map((tech) => (
          <span
            key={tech.name}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${tech.className}`}
          >
            {tech.name}
          </span>
        ))}
      </div>
    </section>
  );
}
