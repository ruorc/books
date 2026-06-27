import { useCallback } from 'react';
import { booksService } from '@/services/booksDataServiceMockApi';
import { useConfirm } from '@/providers/ConfirmProvider';
import { useSnack } from '@/providers/SnackProvider';
import { SNACK_TYPES } from '@/constants/snack';
import type { Book } from '@/types/book';

/**
 * Action dispatch interface mapping local reducer requirements.
 */
type SyncDispatch = (
  action:
    | { type: 'LOCAL_DELETE'; payload: string }
    | {
        type: 'LOCAL_TOGGLE_FAVORITE';
        payload: { id: string; isFavorite: boolean };
      }
) => void;

interface UseBooksActionsProps {
  booksMap: Map<string, Book>;
  dispatch: SyncDispatch;
}

export function useBooksActions({ booksMap, dispatch }: UseBooksActionsProps) {
  const { showConfirm } = useConfirm();
  const { showSnack } = useSnack();

  /**
   * Orchestrates the secure removal workflow by awaiting global modal confirmation.
   * Locked via useCallback to protect nested BookCard list items from redundant renders.
   */
  const handleDeleteBook = useCallback(
    async (id: string) => {
      const targetBook = booksMap.get(id);
      const bookTitle = targetBook ? `"${targetBook.title}"` : 'this book';

      const isConfirmed = await showConfirm({
        title: 'Delete Book Record',
        description: `Are you absolutely sure you want to delete ${bookTitle}?`,
        confirmLabel: 'Delete permanently',
        cancelLabel: 'Keep book',
        isDanger: true,
      });

      if (!isConfirmed) return;

      try {
        // Aligned with the unified interface contract: delete
        await booksService.delete(id);

        dispatch({ type: 'LOCAL_DELETE', payload: id });
        showSnack(
          `${bookTitle} was successfully deleted.`,
          SNACK_TYPES.SUCCESS
        );
      } catch (err) {
        showSnack(
          err instanceof Error ? err.message : 'Server rejected deletion.',
          SNACK_TYPES.ERROR
        );
      }
    },
    [booksMap, dispatch, showConfirm, showSnack]
  );

  /**
   * Synchronizes the favorite state toggle across remote infrastructure and local memory maps.
   * Locked via useCallback to secure stable reference pipelines.
   */
  const handleToggleFavorite = useCallback(
    async (id: string) => {
      const targetBook = booksMap.get(id);
      if (!targetBook) return;

      const updatedStatus = !targetBook.isFavorite;

      try {
        // Aligned with the unified interface contract: patch
        await booksService.patch(id, { isFavorite: updatedStatus });

        dispatch({
          type: 'LOCAL_TOGGLE_FAVORITE',
          payload: { id, isFavorite: updatedStatus },
        });

        showSnack(
          updatedStatus
            ? `"${targetBook.title}" bookmarked.`
            : `"${targetBook.title}" unbookmarked.`,
          SNACK_TYPES.SUCCESS
        );
      } catch (err) {
        showSnack(
          'Server failed to synchronize your favorite status.',
          SNACK_TYPES.ERROR
        );
      }
    },
    [booksMap, dispatch, showSnack]
  );

  return {
    handleDeleteBook,
    handleToggleFavorite,
  };
}
