import { ref, type Ref } from 'vue';

interface UsePaginationOptions {
  initialPage?: number;
  initialPerPage?: number;
}

interface UsePaginationResult {
  page: Ref<number>;
  perPage: Ref<number>;
  setPage: (value: number) => void;
  setPerPage: (value: number) => void;
  reset: () => void;
}

export const usePagination = (options: UsePaginationOptions): UsePaginationResult => {
  const initialPage: number = options.initialPage ?? 1;
  const initialPerPage: number = options.initialPerPage ?? 10;
  const page: Ref<number> = ref(initialPage);
  const perPage: Ref<number> = ref(initialPerPage);

  const setPage = (value: number): void => {
    page.value = value;
  };

  const setPerPage = (value: number): void => {
    perPage.value = value;
  };

  const reset = (): void => {
    page.value = initialPage;
    perPage.value = initialPerPage;
  };

  return {
    page,
    perPage,
    setPage,
    setPerPage,
    reset,
  };
};
