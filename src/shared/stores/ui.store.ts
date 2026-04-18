import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface AddToastType {
  (message: string, type: Toast['type'], duration?: number): string;
}

interface RemoveToastType {
  (id: string): void;
}

interface SetSidebarOpenType {
  (value: boolean): void;
}

interface ToggleSidebarType {
  (): void;
}

export const useUiStore = defineStore('ui', () => {
  const toasts: Ref<Toast[]> = ref([]);
  const isSidebarOpen: Ref<boolean> = ref(false);

  const removeToast: RemoveToastType = (id: string): void => {
    toasts.value = toasts.value.filter((toast: Toast): boolean => toast.id !== id);
  };

  const addToast: AddToastType = (
    message: string,
    type: Toast['type'],
    duration = 4000,
  ): string => {
    const id: string = crypto.randomUUID();
    const toast: Toast = {
      id,
      message,
      type,
      duration,
    };

    toasts.value.push(toast);

    setTimeout((): void => {
      removeToast(id);
    }, duration);

    return id;
  };

  const toggleSidebar: ToggleSidebarType = (): void => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const setSidebarOpen: SetSidebarOpenType = (value: boolean): void => {
    isSidebarOpen.value = value;
  };

  return {
    toasts,
    isSidebarOpen,
    addToast,
    removeToast,
    toggleSidebar,
    setSidebarOpen,
  };
});
