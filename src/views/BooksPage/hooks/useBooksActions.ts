import { useCallback } from 'react';
import { booksService } from '@/services/booksDataServiceMockApi';
import { useConfirm } from '@/context/Confirm/ConfirmProvider';
import { useSnack } from '@/context/Snack/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import type { Book } from '@/types/book';

interface UseBooksActionsProps {
  booksMap: Map<string, Book>;
  // Force update trigger signature to notify parent components about client mutations
  triggerListUpdate: () => void;
}

export function useBooksActions({
  booksMap,
  triggerListUpdate,
}: UseBooksActionsProps) {
  const { showConfirm } = useConfirm();
  const { showSnack } = useSnack();

  /**
   * Optimistically removes a book entity from local cache maps.
   */
  const handleDeleteBook = useCallback(
    async (id: string) => {
      const targetBook = booksMap.get(id);
      if (!targetBook) return;

      const bookTitle = `"${targetBook.title}"`;

      const isConfirmed = await showConfirm({
        title: 'Delete Book Record',
        description: `Are you absolutely sure you want to delete ${bookTitle}?`,
        confirmLabel: 'Delete permanently',
        cancelLabel: 'Keep book',
        isDanger: true,
      });

      if (!isConfirmed) return;

      // Save previous state fallback profile for secure error rollback recovery
      const backupBook = { ...targetBook };

      try {
        // 1. Optimistic UI update: instantly drop item from local client memory cache
        booksMap.delete(id);
        triggerListUpdate(); // Force component re-render

        // 2. Synchronize mutation with the remote server database
        await booksService.delete(id);
        showSnack(
          `${bookTitle} was successfully deleted.`,
          SNACK_TYPES.SUCCESS
        );
      } catch (err) {
        // Rollback: Restore item back into client memory maps if the network pipeline breaks
        booksMap.set(id, backupBook);
        triggerListUpdate();

        showSnack(
          err instanceof Error ? err.message : 'Server rejected deletion.',
          SNACK_TYPES.ERROR
        );
      }
    },
    [booksMap, showConfirm, showSnack, triggerListUpdate]
  );

  /**
   * Optimistically updates metadata properties inside individual entity records.
   * This decoupled design scales natively to generic workflows like "handleEditBook"!
   */
  const handleToggleFavorite = useCallback(
    async (id: string) => {
      const targetBook = booksMap.get(id);
      if (!targetBook) return;

      const currentStatus = targetBook.isFavorite;
      const updatedStatus = !currentStatus;

      try {
        // 1. Optimistic UI update: instantly toggle favorite locally
        targetBook.isFavorite = updatedStatus;
        triggerListUpdate();

        // 2. Synchronize mutation with remote REST server endpoints
        await booksService.patch(id, { isFavorite: updatedStatus });

        showSnack(
          updatedStatus
            ? `"${targetBook.title}" bookmarked.`
            : `"${targetBook.title}" unbookmarked.`,
          SNACK_TYPES.SUCCESS
        );
      } catch (err) {
        // Rollback: Revert fields values if the transaction pipeline fails
        targetBook.isFavorite = currentStatus;
        triggerListUpdate();

        showSnack(
          'Server failed to synchronize your favorite status.',
          SNACK_TYPES.ERROR
        );
      }
    },
    [booksMap, showSnack, triggerListUpdate]
  );

  return {
    handleDeleteBook,
    handleToggleFavorite,
  };
}
