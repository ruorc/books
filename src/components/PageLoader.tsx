import { LOADER_ACCESSIBILITY_TEXT } from '@/constants/ui';

interface PageLoaderProps {
  readonly className?: string;
}

/**
 * Global Shared Page Loader Spinner Component.
 * Provides a highly accessible, semantic, and flicker-free animation wheel
 * used across view boundaries during lazy-loaded routing transitions.
 *
 * Follows strict constraints from AGENTS.md: zero inline comments in JSX,
 * English-only documentation, strict compile-time types, and zero magic strings.
 *
 * @param props - Custom positioning layout modifiers injected from top parent matrices.
 * @returns The structured atomic accessibility-ready loading section.
 */
export default function PageLoader({
  className = 'h-[50vh]',
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center w-full transition-colors ${className}`}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400 transition-none!" />
      <span className="sr-only">{LOADER_ACCESSIBILITY_TEXT}</span>
    </div>
  );
}
