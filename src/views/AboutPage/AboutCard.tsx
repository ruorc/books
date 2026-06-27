import type { ComponentType } from 'react';

interface AboutCardProps {
  title: string;
  value: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  iconColorClass: string; // Tailwind color classes e.g., 'bg-sky-500/10 text-sky-500'
}

export function AboutCard({
  title,
  value,
  description,
  icon: Icon,
  iconColorClass,
}: AboutCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/50">
      {/* Dynamic Icon Container */}
      <div className={`rounded-xl p-3 shrink-0 ${iconColorClass}`}>
        <Icon className="h-6 w-6" />
      </div>

      {/* Text Content */}
      <div className="space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </h3>

        {/* Fixed: removed 'capitalize' class to preserve precise formatting from central constants */}
        <p className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
          {value}
        </p>

        <p className="text-xs leading-normal text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
