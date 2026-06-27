import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
  type Dispatch,
} from 'react';
import { BOOKS_PER_PAGE_LIMIT } from '@/constants/ui';
import type { Book } from '@/types/book';

export interface CatalogState {
  booksMap: Map<string, Book>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

export type CatalogAction =
  | { type: 'FETCH_INIT_START' }
  | { type: 'FETCH_NEXT_START' }
  | {
      type: 'FETCH_SUCCESS';
      payload: { remoteBooks: Book[]; isInitial: boolean };
    }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'NEXT_PAGE' };

const initialState: CatalogState = {
  booksMap: new Map(),
  isLoading: true,
  isFetchingNextPage: false,
  error: null,
  page: 1,
  hasMore: true,
};

function catalogReducer(
  state: CatalogState,
  action: CatalogAction
): CatalogState {
  switch (action.type) {
    case 'FETCH_INIT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        page: 1,
        hasMore: true,
        booksMap: new Map(),
      };
    case 'FETCH_NEXT_START':
      return { ...state, isFetchingNextPage: true, error: null };
    case 'FETCH_SUCCESS': {
      const { remoteBooks, isInitial } = action.payload;
      const nextMap = isInitial ? new Map() : new Map(state.booksMap);
      remoteBooks.forEach((book) => nextMap.set(book.id, book));
      return {
        ...state,
        booksMap: nextMap,
        isLoading: false,
        isFetchingNextPage: false,
        hasMore: remoteBooks.length === BOOKS_PER_PAGE_LIMIT,
      };
    }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isFetchingNextPage: false,
        error: action.payload,
      };
    case 'NEXT_PAGE':
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
}

const BooksCatalogContext = createContext<
  { state: CatalogState; dispatch: Dispatch<CatalogAction> } | undefined
>(undefined);

export function BooksCatalogProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(catalogReducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <BooksCatalogContext.Provider value={contextValue}>
      {children}
    </BooksCatalogContext.Provider>
  );
}

export function useBooksCatalogContext() {
  const context = useContext(BooksCatalogContext);
  if (!context)
    throw new Error(
      'useBooksCatalogContext must be used within a BooksCatalogProvider boundary'
    );
  return context;
}
