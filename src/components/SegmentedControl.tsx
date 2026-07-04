/**
 * A compact, animated segmented control for choosing one option from a mutually exclusive set.
 * It supports keyboard interaction, optional icons, and an inline loading state.
 */
import { useRef, type ComponentType, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

/**
 * Represents a single selectable option within the segmented control.
 */
export interface SegmentedOption<T extends string> {
  /** Unique identifying token literal bound to the core generic state model. */
  id: T;
  /** Human-readable descriptive text visible to the user. */
  label: string;
  /** Optional icon graphic component injected before the textual label. */
  icon?: ComponentType<{
    /** Optional class name applied to the rendered icon SVG or wrapper. */
    className?: string;
  }>;
}

/**
 * Props for the SegmentedControl component describing structure, state, and callbacks.
 */
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
 */
const BUTTON_STATE_STYLES = {
  active: 'text-slate-900 dark:text-slate-50 cursor-default',
  loading: 'text-slate-400 dark:text-slate-600 pointer-events-none',
  idle: 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 cursor-pointer',
} as const;

/**
 * Renders a compact segmented control for switching between mutually exclusive options.
 *
 * It provides keyboard navigation, animated active-state highlighting,
 * and an optional loading state that disables interaction.
 */
export function SegmentedControl<T extends string>({
  id,
  options,
  value,
  onChange,
  isLoading = false,
}: SegmentedControlProps<T>) {
  /**
   * Ref map storing button nodes for keyboard focus management.
   */
  const buttonRefs = useRef<Map<T, HTMLButtonElement | null>>(new Map());

  /**
   * Keyboard navigation handler for arrow key selection support.
   *
   * Supports left/right and up/down arrow navigation while preserving
   * the current value and focus state for the active option.
   */
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
