/**
 * Presentation view component displaying the primary title and background text.
 * Introduces the technical purpose of the application by highlighting
 * the architectural differences between Class and Functional paradigms.
 * Written strictly in plain textual format without any token or param tags.
 */
export function AboutHeader() {
  return (
    <section className="text-center space-y-4 sm:text-left">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
        About BookSPA Project
      </h1>

      <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
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
