import { ShieldAlert } from 'lucide-react';

export function AboutSecurity() {
  return (
    <section className="flex items-start gap-3 rounded-xl border border-red-500/10 bg-red-500/5 p-4 transition-colors duration-200">
      {/* Alert icon with fixed sizing to prevent squeezing on mobile screens */}
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

      {/* Informative text content explaining env variables safety */}
      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
        {/* Improved color contrast for dark mode explicitly using responsive states */}
        <h4 className="font-bold text-red-600 dark:text-red-400">
          API Security Advisory
        </h4>
        <p>
          Your private MockAPI token is safely excluded from source control. All
          environment variables are filtered by the{' '}
          <span className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">
            .gitignore
          </span>{' '}
          pattern and will never be pushed to public GitHub repositories.
        </p>
      </div>
    </section>
  );
}
