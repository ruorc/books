import { useEffect, useRef } from 'react';

/**
 * Structural communication contract defining all mandatory parameters
 * required to initialize the keyboard accessibility focus trap tracker.
 */
interface UseFocusTrapProps {
  /** Boolean toggle indicating whether the structural interceptor engine is active */
  readonly isOpen: boolean;
  /** Trigger callback function dispatched instantly when the Escape key matrix triggers */
  readonly onClose: () => void;
}

/**
 * Structural contract defining the reference bound to the interactive container node.
 */
interface UseFocusTrapResult {
  /** Mutable React reference bound strictly to the outer wrapper container element */
  readonly containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Universal layout-agnostic custom hook managing accessibility focus cycles.
 * Contextually locks keyboard tab shifting vectors strictly inside active overlay boxes.
 * Blocks window viewports background scrolling interactions safely to protect focus trees.
 */
export function useFocusTrap({
  isOpen,
  onClose,
}: UseFocusTrapProps): UseFocusTrapResult {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;

    if (!container) return;

    const originalOverflow = window.getComputedStyle(document.body).overflow;

    document.body.style.overflow = 'hidden';

    /**
     * Queries all potentially interactive semantic HTML elements within the active container.
     */
    const getFocusableElements = (): readonly HTMLElement[] => {
      const selectors =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const nodes = container.querySelectorAll<HTMLElement>(selectors);

      return Array.from(nodes);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();

        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements();

        if (focusable.length === 0) return;

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];
        const activeElement = document.activeElement as HTMLElement;

        if (e.shiftKey) {
          if (activeElement === firstEl) {
            lastEl?.focus();
            e.preventDefault();
          }
        } else {
          if (activeElement === lastEl) {
            firstEl?.focus();
            e.preventDefault();
          }
        }
      }
    };

    // Automatically shift focus to the first interactive node upon opening
    const focusTimeout = setTimeout(() => {
      const focusable = getFocusableElements();

      if (focusable.length > 0) {
        focusable[0]?.focus();
      }
    }, 50);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return { containerRef };
}
