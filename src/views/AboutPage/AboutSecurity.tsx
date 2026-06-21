import { ShieldAlert } from 'lucide-react';

export function AboutSecurity() {
  return (
    <section className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex gap-3 items-start">
      <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
      <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <h4 className="font-bold text-red-600/90 dark:text-red-400/90">
          API Security Advisory
        </h4>
        <p>
          Your private MockAPI token is safely excluded from source control. All
          environment variables are filtered by the{' '}
          <span className="font-mono">.gitignore</span> pattern and will never
          be pushed to public GitHub repositories.
        </p>
      </div>
    </section>
  );
}
