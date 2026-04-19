<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUiStore } from '@/shared/stores/ui.store';

const uiStore = useUiStore();
const { isSidebarOpen } = storeToRefs(uiStore);
const { setSidebarOpen } = uiStore;

const sidebarClasses = computed<Record<string, boolean>>(() => ({
  'app-sidebar--open': isSidebarOpen.value,
}));

const closeSidebar = (): void => {
  setSidebarOpen(false);
};
</script>

<template>
  <div class="app-sidebar-wrapper" :class="sidebarClasses">
    <button
      class="app-sidebar-wrapper__overlay"
      type="button"
      aria-label="Close sidebar"
      @click="closeSidebar"
    />
    <aside class="app-sidebar">
      <div class="app-sidebar__brand">
        <span class="app-sidebar__logo">OD</span>
        <div>
          <p class="app-sidebar__eyebrow">Workspace</p>
          <h1 class="app-sidebar__title">Order Dashboard</h1>
        </div>
      </div>

      <nav class="app-sidebar__nav" aria-label="Main navigation">
        <RouterLink class="app-sidebar__link" to="/orders" @click="closeSidebar">
          Orders
        </RouterLink>
      </nav>
    </aside>
  </div>
</template>

<style scoped>
.app-sidebar-wrapper {
  position: relative;
}

.app-sidebar-wrapper__overlay {
  position: fixed;
  inset: 0;
  z-index: 29;
  border: 0;
  background: rgb(15 23 42 / 48%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.app-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 17.5rem;
  padding: 1.5rem 1rem;
  background: var(--color-sidebar-bg, #1e293b);
  color: var(--color-sidebar-text, #94a3b8);
  transform: translateX(-100%);
  transition: transform 0.22s ease;
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.5rem;
}

.app-sidebar__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.875rem;
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
  color: #fff;
  font-weight: 800;
}

.app-sidebar__eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.app-sidebar__title {
  margin: 0;
  font-size: 1rem;
  color: var(--color-sidebar-active, #fff);
}

.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.app-sidebar__link {
  display: flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: 0.875rem;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.app-sidebar__link:hover {
  background: rgb(148 163 184 / 12%);
  color: var(--color-sidebar-active, #fff);
}

.app-sidebar__link.router-link-active {
  background: rgb(255 255 255 / 10%);
  color: var(--color-sidebar-active, #fff);
}

.app-sidebar--open .app-sidebar-wrapper__overlay {
  opacity: 1;
  pointer-events: auto;
}

.app-sidebar--open .app-sidebar {
  transform: translateX(0);
}

@media (min-width: 1024px) {
  .app-sidebar-wrapper__overlay {
    display: none;
  }

  .app-sidebar {
    transform: translateX(0);
  }
}
</style>
