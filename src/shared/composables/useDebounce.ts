import { ref, watchEffect, type Ref } from 'vue';

export const useDebounce = <T>(value: Ref<T>, delay: number): Ref<T> => {
  const debouncedValue: Ref<T> = ref(value.value) as Ref<T>;

  watchEffect((onCleanup): void => {
    const currentValue: T = value.value;
    const timeoutId: ReturnType<typeof setTimeout> = setTimeout((): void => {
      debouncedValue.value = currentValue;
    }, delay);

    onCleanup((): void => {
      clearTimeout(timeoutId);
    });
  });

  return debouncedValue;
};
