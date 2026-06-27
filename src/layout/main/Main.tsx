import type { PropsWithChildren } from 'react';

export default function Main({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto w-full max-w-7xl grow px-4 py-8 sm:px-6 lg:px-8 focus:outline-none">
      {/* All route-specific page components are rendered inside this container */}
      {children}
    </main>
  );
}
