<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppLayout from '@/shared/components/layout/AppLayout.vue';

const route = useRoute();

const shouldUseAppLayout = computed<boolean>(() => route.meta.requiresAuth !== false);
</script>

<template>
  <AppLayout v-if="shouldUseAppLayout" />
  <RouterView v-else />
</template>
