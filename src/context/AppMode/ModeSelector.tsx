import { Terminal, Code2 } from 'lucide-react';
import { MODES, ENGINE_LABELS, MODE_LAYOUT_ID } from '@/constants/mode';
import type { AppMode } from '@/types/mode';
import { SegmentedControl } from '@/components/SegmentedControl';

/**
 * Options list bound to runtime MODES constants to prevent hardcoding.
 * Labels are resolved dynamically from ENGINE_LABELS to eliminate magic strings.
 */
const modeOptions = [
  { id: MODES.FUNCTIONAL, label: ENGINE_LABELS[MODES.FUNCTIONAL], icon: Code2 },
  { id: MODES.CLASS, label: ENGINE_LABELS[MODES.CLASS], icon: Terminal },
] as const;

interface ModeSelectorProps {
  readonly mode: AppMode;
  readonly onChange: (mode: AppMode) => void;
  readonly isLoading?: boolean;
}

/**
 * Smart Architecture Mode Controller Component.
 * Orchestrates rendering strategy switches between class-based and functional engines.
 * Co-located inside 'src/context/AppMode/' to guarantee encapsulation.
 *
 * Follows strict constraints from AGENTS.md: zero inline comments in JSX,
 * English-only documentation, absolute alias paths, and zero magic strings.
 *
 * @param props - Core control specifications and state synchronizers.
 * @returns The structured type-safe segmented control module.
 */
export default function ModeSelector({
  mode,
  onChange,
  isLoading,
}: ModeSelectorProps) {
  return (
    <SegmentedControl
      id={MODE_LAYOUT_ID}
      options={modeOptions}
      value={mode}
      onChange={onChange}
      isLoading={isLoading}
    />
  );
}
