<script setup lang="ts">
import LoginForm from '@/modules/auth/components/LoginForm.vue';
</script>

<template>
  <section class="login-view">
    <div class="login-view__content">
      <div class="login-view__heading">
        <p class="login-view__eyebrow">Welcome back</p>
        <h1 class="login-view__title">Order Dashboard</h1>
      </div>
      <LoginForm />
    </div>
  </section>
</template>

<style scoped>
.login-view {
  --color-primary: #3b82f6;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text: #1e293b;
  --color-text-muted: #64748b;

  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  background: radial-gradient(circle at top, #dbeafe 0%, var(--color-bg) 38%);
}

.login-view__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.login-view__heading {
  text-align: center;
}

.login-view__eyebrow {
  margin: 0 0 0.5rem;
  color: var(--color-primary, #3b82f6);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-view__title {
  margin: 0;
  color: var(--color-text, #1e293b);
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
}
</style>
