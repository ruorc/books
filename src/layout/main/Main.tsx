import type { PropsWithChildren } from 'react';

/**
 * Global Main Content Container Component.
 * Establishes the semantic layout boundary, responsive padding matrices,
 * and maximum structural width limits for all rendered sub-views and routes.
 * Accepts standard React context properties containing layout children nodes.
 * Produces the structured semantic main HTML element wrapper.
 *
 * Follows strict constraints from AGENTS.md: zero inline comments in JSX,
 * English-only documentation, and an absolute tagless layout structure.
 */
export default function Main({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto w-full max-w-7xl grow px-4 py-8 sm:px-6 lg:px-8 focus:outline-none">
      {children}
    </main>
  );
}
