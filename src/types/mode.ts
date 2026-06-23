import type { MODES } from '@/constants/mode';

export type AppMode = typeof MODES[keyof typeof MODES];
