const LOADER_ACCESSIBILITY_TEXT = 'Loading page content...' as const;

/**
 * Structural communication contract defining parameters accepted by the PageLoader container.
 */
interface PageLoaderProps {
  /** Optional atomic Tailwind CSS class string used to customize layout height and spacing boundaries */
  readonly className?: string;
}

/**
 * Centered Asynchronous Page Loading Indicator Component.
 * Establishes accessible status trees via semantic live region nodes for screen reader tracking.
 */
export const PageLoader = ({
  className = 'h-[50vh]',
}: PageLoaderProps): React.JSX.Element => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center w-full transition-colors ${className}`}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
      <span className="sr-only">{LOADER_ACCESSIBILITY_TEXT}</span>
    </div>
  );
};
