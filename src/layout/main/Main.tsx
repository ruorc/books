import type { PropsWithChildren } from 'react';

export default function Main({ children }: PropsWithChildren) {
  return (
    <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none">
      {/* All route-specific page components are rendered inside this container */}
      {children}
    </main>
  );
}
