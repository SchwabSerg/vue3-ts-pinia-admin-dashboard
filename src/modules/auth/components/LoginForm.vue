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
  <form class="login-form" @submit.prevent="handleSubmit">
    <div class="login-form__field">
      <label class="login-form__label" for="email">Email</label>
      <input id="email" v-model="email" class="login-form__input" type="email" required />
    </div>

    <div class="login-form__field">
      <label class="login-form__label" for="password">Password</label>
      <input
        id="password"
        v-model="password"
        class="login-form__input"
        type="password"
        required
      />
    </div>

    <p v-if="error" class="login-form__error">
      {{ error }}
    </p>

    <BaseButton class="login-form__submit" type="submit" :loading="isLoading">
      Sign In
    </BaseButton>

    <p class="login-form__hint">Use any email and password: password</p>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(100%, 24rem);
  padding: 2rem;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 1.25rem;
  box-shadow: 0 20px 45px rgb(15 23 42 / 10%);
}

.login-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-form__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text, #1e293b);
}

.login-form__input {
  min-height: 2.9rem;
  padding: 0.75rem 0.875rem;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 0.875rem;
  background: #fff;
  color: var(--color-text, #1e293b);
  font: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.login-form__input:focus {
  outline: none;
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 16%);
}

.login-form__error {
  margin: 0;
  padding: 0.875rem 1rem;
  border: 1px solid #fecaca;
  border-radius: 0.875rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 500;
}

.login-form__submit {
  width: 100%;
}

.login-form__hint {
  margin: 0;
  color: var(--color-text-muted, #64748b);
  font-size: 0.875rem;
  text-align: center;
}
</style>
