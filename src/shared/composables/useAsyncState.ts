import { ref, type Ref } from 'vue';
import type { ApiError, LoadingState } from '@/shared/types/api.types';
import { isValidationErrors } from '@/shared/utils/isValidationErrors';

interface UseAsyncStateResult<T> {
  data: Ref<T | null>;
  state: Ref<LoadingState>;
  error: Ref<ApiError | null>;
  execute: () => Promise<T>;
}

const toApiError = (error: unknown): ApiError => {
  if (typeof error === 'object' && error !== null) {
    const message: unknown = Reflect.get(error, 'message');
    const status: unknown = Reflect.get(error, 'status');
    const errors: unknown = Reflect.get(error, 'errors');

    if (typeof message === 'string' && typeof status === 'number') {
      return {
        message,
        status,
        errors: isValidationErrors(errors) ? errors : undefined,
      };
    }
  }

  return {
    message: error instanceof Error ? error.message : 'Unknown error',
    status: 0,
  };
};

export const useAsyncState = <T>(fn: () => Promise<T>): UseAsyncStateResult<T> => {
  const data: Ref<T | null> = ref(null);
  const state: Ref<LoadingState> = ref('idle');
  const error: Ref<ApiError | null> = ref(null);

  const execute = async (): Promise<T> => {
    state.value = 'loading';
    error.value = null;

    try {
      const result: T = await fn();

      data.value = result;
      state.value = 'success';

      return result;
    } catch (caughtError: unknown) {
      const apiError: ApiError = toApiError(caughtError);

      error.value = apiError;
      state.value = 'error';

      throw apiError;
    }
  };

  return {
    data,
    state,
    error,
    execute,
  };
};
