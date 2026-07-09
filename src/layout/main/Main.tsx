import { type ReactNode } from 'react';

/**
 * Structural communication contract specifying properties required to render
 * the primary application main content layout workspace.
 */
interface MainProps {
  /** The composite React element node children nested within the central viewport container */
  readonly children: ReactNode;
}

/**
 * Global Main Content Container Component.
 * Establishes the semantic layout boundary, responsive padding matrices,
 * and maximum structural width limits for all rendered sub-views and routes.
 * Accepts standard React context properties containing layout children nodes.
 * Produces the structured semantic main HTML element wrapper.
 */
export const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <main className="mx-auto w-full max-w-7xl grow px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </main>
  );
};
