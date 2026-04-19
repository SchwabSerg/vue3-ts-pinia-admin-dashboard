<script setup lang="ts">
import LoginForm from '@/modules/auth/components/LoginForm.vue';
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 p-4">
    <div class="w-full max-w-[360px] rounded-xl border border-slate-200 bg-white p-8">
      <div class="mb-1 text-[18px] font-semibold text-slate-900">Order Dashboard</div>
      <div class="mb-6 text-[13px] text-slate-500">Sign in to continue to your workspace</div>
      <LoginForm />
    </div>
  </div>
</template>
