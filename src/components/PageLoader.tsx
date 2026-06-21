interface PageLoaderProps {
  className?: string;
}

export default function PageLoader({
  className = 'h-[50vh]',
}: PageLoaderProps) {
  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
    </div>
  );
}
