export function AboutHeader() {
  return (
    <section className="text-center sm:text-left space-y-4">
      {/* Main semantic heading with responsive text scaling */}
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
        About BookSPA Project
      </h1>
      
      {/* Introduction paragraph showcasing the comparative nature of the project */}
      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        This demonstration project is designed to compare two fundamental
        approaches in React development: classic{' '}
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          Class Components
        </span>{' '}
        and modern{' '}
        <span className="font-semibold text-sky-600 dark:text-sky-400">
          Functional Components
        </span>{' '}
        using Hooks. The book catalog is fully synchronized with a third-party
        REST API (MockAPI) to clearly demonstrate differences in managing
        component lifecycles.
      </p>
    </section>
  );
}
