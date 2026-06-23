export const MODES = {
  FUNCTION: 'function',
  CLASS: 'class',
} as const;

export const MODE_KEY = 'books-app-mode';
export const DEFAULT_MODE = MODES.FUNCTION;
export const MODE_SWITCH_DELAY = 400; // Вынесли магическое число в константу
