/**
 * Structural contract defining individual layout settings passed to trigger a modal dialog view.
 * Features mandatory property documentation layout specifications above every signature field.
 */
export interface ConfirmOptions {
  /** The primary header text displayed at the top of the confirmation dialog */
  readonly title: string;
  /** Detailed explanatory body text describing the consequences of the action */
  readonly description: string;
  /** Optional customized text for the affirmative action button */
  readonly confirmLabel?: string;
  /** Optional customized text for the dismissive action button */
  readonly cancelLabel?: string;
  /** High-severity modifier styling the confirmation layout to emphasize hazardous operations */
  readonly isDanger?: boolean;
}

/**
 * Structural contract defining properties and mutation metrics managed by the Confirm context.
 */
export interface ConfirmContextType {
  /** Triggers the global confirmation flow and returns a Promise waiting for explicit user interaction */
  readonly showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}
