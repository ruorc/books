import { Terminal, Code2 } from 'lucide-react';
import { SegmentedControl, type SegmentedOption } from './SegmentedControl';

export type AppMode = 'function' | 'class';

const modeOptions: readonly SegmentedOption<AppMode>[] = [
  { id: 'function', label: 'Functional', icon: Code2 },
  { id: 'class', label: 'Class', icon: Terminal },
] as const;

interface ModeSelectorProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
  isLoading?: boolean;
}

export function ModeSelector({ mode, onChange, isLoading }: ModeSelectorProps) {
  return (
    <SegmentedControl
      options={modeOptions}
      value={mode}
      onChange={onChange}
      isLoading={isLoading}
    />
  );
}
