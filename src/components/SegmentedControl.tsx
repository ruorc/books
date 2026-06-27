import { useRef, type ComponentType, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';

export interface SegmentedOption<T extends string> {
  id: T;
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

interface SegmentedControlProps<T extends string> {
  id: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  isLoading?: boolean;
}

export function SegmentedControl<T extends string>({
  id,
  options,
  value,
  onChange,
  isLoading = false,
}: SegmentedControlProps<T>) {
  const buttonRefs = useRef<HTMLButtonElement[]>([]);

  // Reset array length before each render cycle to prevent memory leaks
  // and keep references perfectly synchronized with the layout map.
  buttonRefs.current = [];

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isLoading) return;

    const currentIndex = options.findIndex((opt) => opt.id === value);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % options.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + options.length) % options.length;
        break;
      default:
        return;
    }

    const nextOption = options[nextIndex];
    if (nextOption) {
      onChange(nextOption.id);
      setTimeout(() => buttonRefs.current[nextIndex]?.focus(), 0);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Selection control"
      aria-disabled={isLoading} // Semantic indicator for screen readers
      onKeyDown={handleKeyDown}
      className={`relative inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-opacity ${
        isLoading ? 'opacity-70 pointer-events-none' : ''
      }`}
    >
      {options.map((opt, index) => {
        const Icon = opt.icon;
        const isActive = value === opt.id;

        return (
          <button
            key={opt.id}
            ref={(el) => {
              if (el) buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={isLoading}
            onClick={() => {
              if (!isActive) onChange(opt.id);
            }}
            className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus:outline-none z-10 ${
              isActive
                ? 'text-slate-900 dark:text-slate-50 cursor-default'
                : isLoading
                  ? 'text-slate-400 dark:text-slate-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 cursor-pointer'
            }`}
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
