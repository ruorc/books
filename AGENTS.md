# AI Engineering Guidelines & Architecture Standards

## 1. Project Identity & Environment Context

- **Project Name:** Books
- **Application Type:** Single Page Application (SPA)
- **Primary Language:** All code, comments, variables, and documentation must be written strictly in **English**.
- **Execution Target:** High-performance, highly accessible modern web ecosystem.

## 2. Technology Stack & Ecosystem Bounds

- **Build Tool:** Vite 6.x
- **Framework:** React 19.x (Strict compliance with React 19 concurrent features and hooks syntax).
- **Language Compiler:** TypeScript 6.x (Strict mode enabled, no implicit `any`).
- **Styling Architecture:** Tailwind CSS v4 (Powered by `@tailwindcss/vite` plugin, configured via CSS entry point imports, NOT JavaScript/TypeScript config files).
- **Animation Engine:** Framer Motion 12.x
- **Lucide React 1.x** (For icons).

## 3. Directory Structure & Co-location Architecture

- **Co-location Principle (Primary Rule):** All resources (custom hooks, UI sub-components, internal contexts, domain-specific types, and mock datasets) unique to a specific page or layout feature must reside **strictly inside the directory of that specific view or feature**.
- **Prohibition of Global Spill:** Global folders like `src/components/`, `src/hooks/`, or `src/types/` are restricted **ONLY** to genuinely reusable, multi-module abstract building blocks.

## 4. Strict File Separation for Sub-Components

- **One Component, One File:** A single file must contain exactly **ONE** React component declaration.
- **Sub-Component Splitting:** Smaller operational helper sub-components or atomic UI wrappers cannot share a file with the parent view component. They must be extracted into their own standalone files within a local `components/` subfolder at the feature boundary.

## 5. Styling, Layout, and Tailwind CSS v4 Standards

- **Inline First Philosophy:** Apply utility classes directly to JSX elements. Do not abstract structural or spacing classes out of the visual flow.
- **Strict Prohibition of Global/Bulk Class Constants:** Never abstract plain, non-dynamic Tailwind class strings into external constants or standalone JS/TS objects under the premise of "improving readability." Doing so breaks utility-first topography and component encapsulation.
  - _Allowed Exception — Local State/Variant Mapping:_ Abstracting Tailwind classes into structured mapping objects (`as const`) is permitted **ONLY** within the local file boundary, and **ONLY** when classes change reactively based on component states, modes, themes, or props (e.g., `const BADGE_VARIANTS = { success: '...', error: '...' } as const`).
- **FOUC Prevention:** Layout-affecting calculations, state hydration, or dynamic measurements must be handled safely via structural layout workflows to prevent Flash of Unstyled Content (FOUC) or unexpected layout shifts.

## 6. TypeScript-First Documentation Standards (Strict Tagless Mode)

- **Mandatory Readonly Interface Properties:** To preserve absolute data immutability and shield component state matrices against accidental side-channel mutations, all properties inside view communication contracts (Props interfaces) and core database models must feature the strict `readonly` modifier.
- **Absolute Tag Prohibition:** You are STRICTLY FORBIDDEN from using any JSDoc/TSDoc tags starting with the `@` symbol. Do NOT use `@param`, `@return`, `@returns`, `@typeParam`, `@component`, `@property`, or `@template`.
- **Pure Textual Documentation:** Write documentation blocks as plain, high-density engineering prose in English. Describe only the structural intent or business context that TypeScript types cannot express.
- **Mandatory Interface Blocks:** Every exported `interface` or `type` must have an abstract high-level block comment describing its structural purpose.
- **Mandatory Property Documentation:** Every single property descriptor or field signature inside a TypeScript interface must feature an independent, dedicated text comment directly above it.
- **Exported Functions Only:** Standalone internal helper functions or local variables do not require documentation, but all exported components, custom hooks, and core services must have a descriptive top-level comment.

## 7. Accessibility (A11y) & Usability Engineering

- **Semantic HTML Nodes:** Always prioritize semantic elements (`<button>`, `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`) over generic generic `<div>` stacks.
- **Keyboard Navigation Controls:** Interactive nodes must feature high-visibility target indicators (such as focus rings or underline scales) that activate **ONLY** during active keyboard navigation via the `TAB` matrix.
- **Mouse Clicks Isolation:** Hide focus rings on mouse-initiated actions using Tailwind's `focus-visible` variants combined with standard interaction suppression (`focus:outline-none`).

## 8. Git Workflow, Security, and Configuration Management

- **Environment Variable Security:** Never import raw configuration variables directly inside general view components or layout blocks using `import.meta.env.*`.
- **Centralized Config Registry:** Route all active process variables, third-party system configurations, and dynamic features flags through an isolated environment manager located inside `src/config/`.
- **Automated Quality Controls:** All commits are subjected to mandatory staging workflows checking syntax rules via `eslint` and stylistic formats via `prettier` prior to code persistence.

## 9. Available Scripts

- `npm run dev` - Launch local Vite performance hot-reloading pipeline.
- `npm run build` - Compile Type-safe production bundle using SWC/Vite optimizations.
- `npm run lint` - Trigger deep validation matrix using modern flat config ESLint ecosystem.
- `npm run preview` - Instantiate local hosting cluster targeting production bundle builds.

---

## Code Blueprints

### Component Blueprint (Strict Tagless and Feature-Driven Architecture)

```typescript
/* src/views/BooksPage/components/BookFilterButton.tsx */

/**
 * Structural communication contract defining all reactive data properties
 * required to render the catalog interaction control matrix.
 */
interface BookFilterButtonProps {
  /** Reactive state indicating if the specific filter condition is active */
  readonly isActive: boolean;
  /** Visible dynamic text string rendered inside the interaction box */
  readonly label: string;
  /** Triggered action callback routing the click token to parent view state engines */
  readonly onClick: () => void;
}

const BUTTON_VARIANTS = {
  active: 'bg-neutral-900 text-white focus-visible:outline-neutral-900',
  inactive: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 focus-visible:outline-neutral-200',
} as const;

/**
 * Atomic functional component rendering accessible collection filtration controllers.
 * Completely eliminates inline layout documentation and manages focus-rings contextually.
 */
export const BookFilterButton: React.FC<BookFilterButtonProps> = ({
  isActive,
  label,
  onClick,
}) => {
  const currentVariant = isActive ? BUTTON_VARIANTS.active : BUTTON_VARIANTS.inactive;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Filter books collection by ${label}`}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none ${currentVariant}`}
    >
      {label}
    </button>
  );
};
```
