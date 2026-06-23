import { Terminal, Code2 } from 'lucide-react';
import { MODES } from '@/constants/mode';
import type { AppMode } from '@/types/mode';
import { SegmentedControl } from './SegmentedControl';

// Options list bound to runtime MODES constants to prevent hardcoding
const modeOptions = [
  { id: MODES.FUNCTION, label: 'Functional', icon: Code2 },
  { id: MODES.CLASS, label: 'Class', icon: Terminal },
] as const;

interface ModeSelectorProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
  isLoading?: boolean;
}

export function ModeSelector({ mode, onChange, isLoading }: ModeSelectorProps) {
  return (
    <SegmentedControl
      id="app-mode" // Unique scope ID isolates Framer Motion animations from ThemeSelector
      options={modeOptions}
      value={mode}
      onChange={onChange}
      isLoading={isLoading}
    />
  );
}
