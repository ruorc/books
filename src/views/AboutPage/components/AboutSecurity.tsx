import { type ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

const SECURITY_ADVISORY_TITLE = 'API Security Advisory' as const;
const SECURITY_ADVISORY_BODY_BEFORE_CODE =
  'Your private MockAPI token is safely excluded from source control. All environment variables are filtered by the ' as const;
const SECURITY_ADVISORY_BODY_AFTER_CODE =
  ' pattern and will never be pushed to public GitHub repositories.' as const;

/**
 * Advisory notification block displaying environment safety configurations.
 * Informs the developer about token exclusion strategies using semantic node tiers.
 */
export function AboutSecurity(): ReactNode {
  return (
    <section
      role="note"
      aria-label="Security Notice"
      className="flex items-start gap-3 rounded-xl border border-red-500/10 bg-red-500/5 p-4 transition-colors duration-200"
    >
      <ShieldAlert
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
      />

      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
        <h4 className="font-bold text-red-600 dark:text-red-400">
          {SECURITY_ADVISORY_TITLE}
        </h4>
        <p>
          {SECURITY_ADVISORY_BODY_BEFORE_CODE}
          <span className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">
            .gitignore
          </span>
          {SECURITY_ADVISORY_BODY_AFTER_CODE}
        </p>
      </div>
    </section>
  );
}
