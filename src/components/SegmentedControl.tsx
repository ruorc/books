import type { ComponentType } from 'react';

export interface SegmentedOption<T extends string> {
  id: T;
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  isLoading?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  isLoading = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`relative inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-opacity ${
        isLoading ? 'opacity-70' : ''
      }`}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.id;

        return (
          <button
            key={opt.id}
            disabled={isLoading || isActive}
            onClick={() => {
              if (isActive || isLoading) return;
              onChange(opt.id);
            }}
            className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus:outline-none ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50 cursor-default'
                : isLoading
                  ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed' // 3. Стиль и курсор блокировки во время загрузки
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 cursor-pointer'
            }`}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
