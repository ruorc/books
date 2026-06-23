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
    <div className="p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 flex items-start gap-4 transition-colors duration-200">
      
      {/* Dynamic Icon Container */}
      <div className={`p-3 rounded-xl shrink-0 ${iconColorClass}`}>
        <Icon className="h-6 w-6" />
      </div>

      {/* Text Content */}
      <div className="space-y-1">
        <h3 className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider">
          {title}
        </h3>
        
        {/* Fixed: removed 'capitalize' class to preserve precise formatting from central constants */}
        <p className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
          {value}
        </p>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          {description}
        </p>
      </div>

    </div>
  );
}
