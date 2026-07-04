import { Terminal, Code2 } from 'lucide-react';
import { MODES, ENGINE_LABELS, MODE_LAYOUT_ID } from '@/constants/mode';
import type { AppMode } from '@/types/mode';
import { SegmentedControl } from '@/components/SegmentedControl';

const modeOptions = [
  { id: MODES.FUNCTIONAL, label: ENGINE_LABELS[MODES.FUNCTIONAL], icon: Code2 },
  { id: MODES.CLASS, label: ENGINE_LABELS[MODES.CLASS], icon: Terminal },
] as const;

/**
 * Structural communication contract defining all reactive data properties
 * required to render the application paradigm architecture selection controllers.
 */
interface ModeSelectorProps {
  /** The currently selected active application paradigm architecture execution strategy mode */
  readonly mode: AppMode;
  /** Callback invoked when the user selects a different delayed strategy architecture engine */
  readonly onChange: (mode: AppMode) => void;
  /** Boolean toggle enforcing global disabled presentation and interaction loading states */
  readonly isLoading?: boolean;
}

/**
 * Smart Architecture Mode Controller Component.
 * Orchestrates rendering strategy switches between class-based and functional engines.
 * Co-located inside 'src/context/AppMode/' to guarantee encapsulation boundaries.
 * Follows strict constraints: zero inline comments in JSX and plain tagless engineering text.
 */
export function ModeSelector({ mode, onChange, isLoading }: ModeSelectorProps) {
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
