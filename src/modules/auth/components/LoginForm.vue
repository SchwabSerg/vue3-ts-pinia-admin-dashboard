<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/shared/components/ui/BaseButton.vue';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import type { LoginCredentials } from '@/modules/auth/domain/auth.types';

const router = useRouter();
const authStore = useAuthStore();

const email: Ref<string> = ref('');
const password: Ref<string> = ref('');
const error: Ref<string | null> = ref(null);
const isLoading: Ref<boolean> = ref(false);

const toErrorMessage = (value: unknown): string => {
  if (typeof value === 'object' && value !== null) {
    const message: unknown = Reflect.get(value, 'message');

    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  return 'Unable to sign in';
};

const handleSubmit = async (): Promise<void> => {
  isLoading.value = true;
  error.value = null;

  try {
    const credentials: LoginCredentials = {
      email: email.value,
      password: password.value,
    };

    await authStore.login(credentials);
    await router.push({ name: 'orders' });
  } catch (err: unknown) {
    error.value = toErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium text-slate-600">Email</label>
      <input
        v-model="email"
        type="email"
        placeholder="you@company.com"
        autocomplete="email"
        class="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium text-slate-600">Password</label>
      <input
        v-model="password"
        type="password"
        placeholder="••••••••"
        autocomplete="current-password"
        class="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
      />
    </div>

    <div v-if="error" class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-600">
      {{ error }}
    </div>

    <BaseButton class="h-9 w-full !rounded-lg !bg-blue-500 !px-3 !text-[13px] hover:!bg-blue-600" type="submit" :loading="isLoading">
      {{ isLoading ? 'Signing in...' : 'Sign in' }}
    </BaseButton>

    <div class="text-center text-xs text-slate-400">
      Use any email and password: <strong class="font-medium text-slate-500">password</strong>
    </div>
  </form>
</template>
