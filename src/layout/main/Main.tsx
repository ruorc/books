import type { PropsWithChildren } from 'react';

function Main({ children }: PropsWithChildren) {
  return (
    <main className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  );
}
export default Main;
