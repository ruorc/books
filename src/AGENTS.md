# AGENTS.md

## Project Overview

- **Name:** Books
- **Type:** Single Page Application (SPA)
- **Routing:** Client-side via `react-router-dom` (v7+).
- **Language Environment:** All development artifacts (code, comments, commits, pull requests, tasks) must be strictly in **English**.

## Technology Stack (Strict Versions)

Adhere to the documentation and syntax of these specific major versions:

- **React 19** (Utilize modern hooks and features; do not use legacy APIs).
- **Vite 6** (Build tool and dev server).
- **Tailwind CSS v4** (Configuration is handled via CSS files and `@theme` directives, NOT `tailwind.config.js`. Powered by `@tailwindcss/vite`).
- **TypeScript 6.x** (Strict typing is enforced).
- **Framer Motion 12.x** (For animations).
- **Lucide React 1.x** (For icons).

## Directory Structure & Architecture

Always place new files into their respective directories according to this architecture:

### Global Directories

- `src/components/` — Shared, pure, layout-agnostic UI building blocks (e.g., Button, Input, Modal wrapper). They must NEVER import from global context spaces or hold smart application business states.
- `src/constants/` — Global immutable system invariants, domain constants, and shared keys (e.g., routing strings, configuration constants).
- `src/config/` — System environment setups, API clients specifications, and core engine parameters.
- `src/context/` — Self-contained Global Context Modules. Each folder here represents an isolated application state domain (e.g., `AppMode/`, `Theme/`, `Confirm/`). It houses the Context definition, the custom hook, and all smart UI controllers/selectors dedicated exclusively to managing that specific domain state.
- `src/hooks/` — Global abstract stateful utilities used across multiple independent views (e.g., `useDebounce`, `useWindowDimensions`).
- `src/providers/` — The Root Composition Layer. Contains ONLY the top-level aggregator (e.g., `AppProviders.tsx`) that builds the nested provider tree for application boot injection. No business logic or local components are allowed here.
- `src/routers/` — Application topography route mapping definitions and client-side router instantiation matrices.
- `src/services/` — Universal network fetch transport coordinators, infrastructure-level API handlers, and data mapping contracts.
- `src/types/` — Global architectural domain contracts, core TypeScript interfaces, and shared data transfer objects (DTOs).
- `src/views/` — Main view page boundaries and feature modules, strictly adhering to the view-specific co-location rule.

### View-Specific Co-location Rule (Strict)

Every page must be placed in its own dedicated subfolder inside `src/views/`.

- **Never** place page-specific hooks, components, contexts, or local types into the global `src/` subfolders.
- Local utilities, states, hooks, and contexts must be co-located inside the specific view folder.

**Folder Structure Example (`src/views/BooksPage`):**
src/views/BooksPage/├── BooksPage.tsx # Main page component├── index.ts # Clean export for the page├── components/ # Components used ONLY on this page│ └── BookCard.tsx├── hooks/ # Hooks used ONLY on this page│ └── useBooksCatalog.ts├── providers/ # React Contexts used ONLY on this page│ └── BooksPageContext.tsx└── types/ # Types used ONLY on this page└── local.types.ts

## Core Engineering Rules & Constraints

### 1. Single Responsibility (One Thing Only)

- **Components:** Each React component must do exactly one thing. If a component contains layout, data fetching, and list rendering altogether, extract it into isolated functions, hooks, or sub-components.
- **Functions:** A function must perform a single operation. Break down complex logic into small, testable, and pure utility functions.

### 2. DRY (Don't Repeat Yourself)

- Avoid duplicate code logic, layout schemas, or calculations.
- Extract common code into global helper utilities (`src/hooks/`, `src/components/`) only if it is genuinely shared. If it is local to a page, abstract it within that specific page's `hooks/` or `components/` subfolder.

### 3. Screen Reader Support & Accessibility (A11y)

- All elements must be fully accessible. Use semantic HTML tags (`<main>`, `<nav>`, `<article>`, `<header>`, `<footer>`, `<button>`) instead of generic `<div>` wrappers.
- Always supply essential `aria-*` attributes (`aria-label`, `aria-expanded`, `aria-live`, `aria-describedby`) where interactive state changes or abstract controls occur.
- Interactive elements must be fully navigable via keyboard (`tabindex`, `onKeyDown` handlers) and include distinct focus indicator states (`focus-visible`).

### 4. Prevention of FOUC (Flash of Unstyled Content) & Content Layout Shifts (CLS)

- Ensure all styles and initial layouts are server/build ready. Avoid flashes of raw content during client-side state initialization, font injection, or hydration.
- Use explicit dimensions for layout skeletons, dynamic containers, and images.
- When working with `framer-motion`, ensure initial animation states do not cause content jumps or sudden structural flashes on initial layout paint.

### 5. Tailwind CSS Styling & Component Splitting Rules

- **Utility-First Priority:** Write Tailwind classes strictly inline within the JSX elements. This keeps styles co-located with structure and ensures optimal build sizes and seamless IDE tooltips/autocomplete features.
- **Strict Prohibition of Global/Bulk Class Constants:** Never abstract plain, non-dynamic Tailwind class strings into external constants or standalone JS/TS objects under the premise of "improving readability." Doing so breaks utility-first topography and component encapsulation.
- **Allowed Exception — Local State/Variant Mapping:** Abstracting Tailwind classes into structured mapping objects (`as const`) is permitted **ONLY** within the local file boundary, and **ONLY** when classes change reactively based on component states, modes, themes, or props (e.g., `const BADGE_VARIANTS = { success: '...', error: '...' } as const`).
- **Component-Driven Abstraction over Class Copying:** If a set of static Tailwind classes is repeated across multiple elements or fields, do **NOT** share a raw string constant. Instead, abstract the layout pattern into a small, single-purpose, atomic React component (following the Single Responsibility principle).
- **Avoid `@apply` Overuse:** Do **not** create CSS Modules or standalone `.css` files just to bundle Tailwind classes via `@apply`. This breaks the utility-first paradigm.
- **Allowed `@apply` Exception:** `@apply` is only permitted inside global style sheets (e.g., `src/index.css`) for setting global baseline resets or modifying third-party UI libraries inside the `@layer base` tier.

### 6. No Magic Strings

- All string literals used for routing, storage keys, API endpoints, action types, or statuses **must** be stored as constants or enums.
- Application settings and external integration keys must reside in `src/config/` (e.g., `src/config/mockapi.ts`).
- Domain values and internal keys must reside in `src/constants/`.

### 7. Environment Variables & API Configuration

The application relies on the following environment variables defined in `.env`:

- `VITE_MOCKAPI_PROJECT_TOKEN` — Token for the MockAPI service.
- `VITE_MOCKAPI_ENDPOINT` — MockAPI project endpoint identifier.

**Rules for Environment Variables:**

- **Never** access `import.meta.env` directly inside components or hooks.
- All environment variables must be exposed to the application through a central configuration file in `src/config/`.

### 8. Git & Documentation Workflow

- **Commit Messages:** Must follow the Conventional Commits specification (e.g., `feat:`, `fix:`, `refactor:`) in **English**.
- **Documentation:** All internal docs, code readmes, and inline comments must be written in **English**.

## Code Blueprints

### Accessible, Isolated, Single-Responsibility Component Example

```typescript
// src/views/BooksPage/components/BookFilterButton.tsx

interface BookFilterButtonProps {
  readonly isActive: boolean;
  readonly label: string;
  readonly onClick: () => void;
}

// Good: Performs one single thing, provides full screen reader support, prevents FOUC with stable layout
export const BookFilterButton: React.FC<BookFilterButtonProps> = ({
  isActive,
  label,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Filter books by ${label}`}
      className={`px-4 py-2 rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};
```

## Available Scripts

- `npm run dev` — Start the local Vite development server.
  <!-- - `npm run build` — Run TypeScript type-checking and build production assets. -->
  <!-- - `npm run lint` — Analyze code quality with ESLint 10. -->
  <!-- - `npm run preview` — Locally preview the production build output. -->
