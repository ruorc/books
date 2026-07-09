import { type ComponentType, type ReactNode } from 'react';

/**
 * Structural contract defining properties accepted by theme and engine icons.
 */
interface AboutCardIconProps {
  /** Optional atomic Tailwind CSS class string used to control icon vector sizing */
  readonly className?: string;
}

/**
 * Structural communication contract defining all reactive data properties
 * required to render individual feature status display blocks.
 */
interface AboutCardProps {
  /** The small uppercase category label positioned at the top of the card text group */
  readonly title: string;
  /** The primary highlighted status or engine configuration token text value */
  readonly value: string;
  /** Comprehensive details explaining the current operational target state */
  readonly description: string;
  /** SVG graphic react node layout displaying the identifier icon */
  readonly icon: ComponentType<AboutCardIconProps>;
  /** Combined atomic Tailwind utility classes managing background opacity and icon vector colors */
  readonly iconColorClass: string;
}

/**
 * Atomic layout block presenting specific runtime app metrics or visual modes.
 */
export function AboutCard({
  title,
  value,
  description,
  icon: Icon,
  iconColorClass,
}: AboutCardProps): ReactNode {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/50">
      <div className={`rounded-xl p-3 shrink-0 ${iconColorClass}`}>
        <Icon aria-hidden="true" className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </h3>

        <p className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
          {value}
        </p>

        <p className="text-xs leading-normal text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
