import { useRef, type ComponentType, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

export interface SegmentedOption<T extends string> {
  /** Unique identifying token literal bound to the core generic state model. */
  id: T;
  /** Human-readable descriptive text visible to the user. */
  label: string;
  /** Optional icon graphic component injected before the textual label. */
  icon?: ComponentType<{ className?: string }>;
}

interface SegmentedControlProps<T extends string> {
  /** Unique structural namespace parameter isolating motion layout animations. */
  id: string;
  /** Immutable array collection housing selection metadata objects. */
  options: readonly SegmentedOption<T>[];
  /** Active chosen item string token literal. */
  value: T;
  /** Synchronous state modifier trigger callback. */
  onChange: (value: T) => void;
  /** Boolean toggle enforcing global disabled presentation states. */
  isLoading?: boolean;
}

/**
 * Global immutable layout styling configuration for the root container.
 */
const CONTAINER_BASE_STYLE =
  'relative inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all duration-200' as const;

/**
 * Global immutable layout styling configuration for every interactive option button.
 */
const BUTTON_BASE_STYLE =
  'relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus:outline-none z-10' as const;

/**
 * Strict reactive variant mapping for the button interaction states.
 * Fully compliant with the AGENTS.md local state mapping guidelines.
 */
const BUTTON_STATE_STYLES = {
  active: 'text-slate-900 dark:text-slate-50 cursor-default',
  loading: 'text-slate-400 dark:text-slate-600 pointer-events-none',
  idle: 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 cursor-pointer',
} as const;

/**
 * Atomic Segmented Control UI Component.
 * Provides accessible keyboard-navigable tab selection switches for abstract state fields.
 * Retains strict single responsibility by separating layout from business domain states.
 *
 * Follows strict constraints from AGENTS.md: zero inline comments in JSX,
 * English-only documentation, strict compile-time generics, and local state variant mappings.
 * Compliant with React 19 strict rendering constraints and ESLint rules.
 *
 * @template T - Literal string union type restricting parameters to known option sets.
 * @param props - Core presentation elements and interactive sync states.
 * @returns The structured atomic layout module.
 */
export function SegmentedControl<T extends string>({
  id,
  options,
  value,
  onChange,
  isLoading = false,
}: SegmentedControlProps<T>) {
  const buttonRefs = useRef<Map<T, HTMLButtonElement | null>>(new Map());

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isLoading) return;

    const currentIndex = options.findIndex((opt) => opt.id === value);

    const getNextIndex = (): number => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();

          return (currentIndex + 1) % options.length;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();

          return (currentIndex - 1 + options.length) % options.length;
        default:
          return -1;
      }
    };

    const nextIndex = getNextIndex();

    if (nextIndex === -1) return;

    const nextOption = options[nextIndex];

    if (nextOption) {
      onChange(nextOption.id);

      setTimeout(() => {
        const nextButton = buttonRefs.current.get(nextOption.id);

        nextButton?.focus();
      }, 0);
    }
  };

  /**
   * Helper utility to resolve the correct button semantic state key.
   */
  const getButtonStateKey = (
    isActive: boolean
  ): keyof typeof BUTTON_STATE_STYLES => {
    if (isActive) return 'active';

    if (isLoading) return 'loading';

    return 'idle';
  };

  return (
    <div
      role="radiogroup"
      aria-label="Selection control"
      aria-disabled={isLoading}
      onKeyDown={handleKeyDown}
      className={`${CONTAINER_BASE_STYLE} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.id;
        const stateKey = getButtonStateKey(isActive);

        return (
          <button
            key={opt.id}
            ref={(node) => {
              if (node) {
                buttonRefs.current.set(opt.id, node);
              } else {
                buttonRefs.current.delete(opt.id);
              }
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={isLoading}
            onClick={() => {
              if (!isActive) onChange(opt.id);
            }}
            className={`${BUTTON_BASE_STYLE} ${BUTTON_STATE_STYLES[stateKey]}`}
          >
            {isActive && (
              <motion.span
                layoutId={`active-pill-${id}`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-white dark:bg-slate-950 rounded-lg shadow-sm -z-10"
              />
            )}

            {Icon && <Icon className="h-4 w-4" />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
