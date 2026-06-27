interface PageLoaderProps {
  className?: string;
}

export default function PageLoader({
  className = 'h-[50vh]',
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center w-full transition-colors ${className}`}
    >
      {/* 
        Animated spinning wheel using semantic border styling. 
        Added 'not-prose' and forced transition-none to isolate keyframe spinning 
        from any global theme transition triggers.
      */}
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400 transition-none!" />

      {/* Visually hidden text for screen readers (Accessibility) */}
      <span className="sr-only">Loading page content...</span>
    </div>
  );
}
