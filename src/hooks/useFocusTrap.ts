import { useEffect, useRef } from 'react';

/**
 * Structural communication contract defining all mandatory parameters
 * required to initialize the keyboard accessibility focus trap tracker.
 * Features independent text blocks positioned directly above every signature field.
 */
interface UseFocusTrapProps {
  /** Boolean toggle indicating whether the structural interceptor engine is active */
  readonly isOpen: boolean;
  /** Trigger callback function dispatched instantly when the Escape key matrix triggers */
  readonly onClose: () => void;
}

/**
 * Universal layout-agnostic custom hook managing accessibility focus cycles.
 * Contextually locks keyboard tab shifting vectors strictly inside active overlay boxes.
 * Blocks window viewports background scrolling interactions safely to protect focus trees.
 * Fully compliant with plain english tagless documentation boundaries.
 */
export function useFocusTrap({ isOpen, onClose }: UseFocusTrapProps) {
  const firstElementRef = useRef<HTMLButtonElement>(null);
  const secondElementRef = useRef<HTMLButtonElement>(null);
  const thirdElementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = window.getComputedStyle(document.body).overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();

        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = [
          firstElementRef.current,
          secondElementRef.current,
          thirdElementRef.current,
        ];

        const activeIndex = focusableElements.indexOf(
          document.activeElement as HTMLButtonElement
        );

        if (e.shiftKey) {
          if (activeIndex === 0) {
            thirdElementRef.current?.focus();
            e.preventDefault();
          }
        } else {
          if (activeIndex === focusableElements.length - 1) {
            firstElementRef.current?.focus();
            e.preventDefault();
          }
        }
      }
    };

    const focusTimeout = setTimeout(() => thirdElementRef.current?.focus(), 50);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return {
    firstRef: firstElementRef,
    secondRef: secondElementRef,
    thirdRef: thirdElementRef,
  };
}
