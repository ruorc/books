import { useRef, type ComponentType, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

/**
 * Structural contract defining properties required to render a singular
 * selectable option entity inside the polymorphic control matrix.
 */
export interface SegmentedOption<T extends string> {
  /** Unique identifying token literal bound to the core generic state model */
  readonly id: T;
  /** Human-readable descriptive text visible to the user within the control button */
  readonly label: string;
  /** Optional structural icon component injected before the textual label string */
  readonly icon?: ComponentType<{
    /** Optional class name utility string applied to the rendered icon node */
    readonly className?: string;
  }>;
}

/**
 * Structural contract describing reactive states, configuration rules,
 * and transaction hooks required to mount the control layout.
 */
interface SegmentedControlProps<T extends string> {
  /** Unique structural namespace parameter isolating layout motion shared animations */
  readonly id: string;
  /** Immutable array collection housing configuration descriptors and labels */
  readonly options: readonly SegmentedOption<T>[];
  /** Active chosen item string token literal evaluating state conditions */
  readonly value: T;
  /** Synchronous state modifier trigger callback routing tokens back to parent view layers */
  readonly onChange: (value: T) => void;
  /** Visual presentation theme configuration variant managing focus and background tokens */
  readonly variant?: 'system' | 'brand';
  /** Boolean toggle enforcing global disabled presentation and interaction loading states */
  readonly isLoading?: boolean;
}

const BUTTON_STATE_STYLES = {
  active: 'text-slate-900 dark:text-slate-50 cursor-default',
  loading: 'text-slate-400 dark:text-slate-600 pointer-events-none',
  idle: 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 cursor-pointer',
} as const;

const THEME_VARIANTS = {
  system: {
    container:
      'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800',
    button: 'focus-visible:ring-indigo-500',
    pill: 'bg-white dark:bg-slate-950',
  },
  brand: {
    container:
      'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50',
    button: 'focus-visible:ring-emerald-600',
    pill: 'bg-emerald-600 text-white dark:bg-emerald-500',
  },
} as const;

/**
 * Universal accessible navigation segmented interaction component.
 * Manages spring-animated option highlighting states, handles keyboard arrow focus matrices
 * transparently, and isolates layout states safely under React 19 execution targets.
 */
export function SegmentedControl<T extends string>({
  id,
  options,
  value,
  onChange,
  variant = 'system',
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

  const getButtonStateKey = (
    isActive: boolean
  ): keyof typeof BUTTON_STATE_STYLES => {
    if (isActive) return 'active';
    if (isLoading) return 'loading';
    return 'idle';
  };

  const activeTheme = THEME_VARIANTS[variant];

  return (
    <div
      role="radiogroup"
      aria-label="Selection control"
      aria-disabled={isLoading}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex rounded-xl p-1 border transition-all duration-200 ${activeTheme.container} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.id;
        const stateKey = getButtonStateKey(isActive);

        const activeTextOverride =
          isActive && variant === 'brand'
            ? 'text-white dark:text-slate-950 font-semibold'
            : BUTTON_STATE_STYLES[stateKey];

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
            className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus:outline-none z-10 ${activeTheme.button} ${activeTextOverride}`}
          >
            {isActive && (
              <motion.span
                layoutId={`active-pill-${id}`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`absolute inset-0 rounded-lg shadow-sm -z-10 ${activeTheme.pill}`}
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
