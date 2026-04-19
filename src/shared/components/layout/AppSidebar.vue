<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUiStore } from '@/shared/stores/ui.store';

const uiStore = useUiStore();
const { isSidebarOpen } = storeToRefs(uiStore);
const { setSidebarOpen } = uiStore;

const closeSidebar = (): void => {
  setSidebarOpen(false);
};
</script>

<template>
  <div class="relative w-[220px] shrink-0">
    <button
      class="fixed inset-0 z-30 bg-slate-900/55 backdrop-blur-[2px] transition-opacity duration-150"
      :class="isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
      type="button"
      aria-label="Close sidebar"
      @click="closeSidebar"
    />
    <aside
      class="fixed inset-y-0 left-0 z-40 flex h-screen w-[220px] shrink-0 flex-col border-r border-white/10 bg-slate-950"
    >
      <div class="flex h-[52px] items-center gap-2.5 border-b border-white/10 px-3.5">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-blue-800 text-[11px] font-bold text-blue-200">
          OD
        </div>
        <span class="text-[13px] font-semibold text-slate-100">Order Dashboard</span>
      </div>

      <nav class="flex-1 p-2" aria-label="Main navigation">
        <RouterLink v-slot="{ href, navigate, isActive }" to="/orders" custom>
          <a
            :href="href"
            class="mb-px flex h-[34px] items-center gap-[9px] rounded-[7px] px-2.5 text-[13px] no-underline transition-colors duration-150"
            :class="isActive ? 'bg-white/10 text-slate-100' : 'text-slate-500'"
            @click="
              navigate($event);
              closeSidebar();
            "
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M2 4h12M2 8h8M2 12h10"/>
            </svg>
            Orders
          </a>
        </RouterLink>
      </nav>

      <div class="border-t border-white/10 p-2.5">
        <div class="flex items-center gap-2 px-2 py-1.5">
          <div class="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-sky-950 text-[10px] font-semibold text-blue-200">
            OD
          </div>
          <span class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-400">Operations</span>
        </div>
      </div>
    </aside>
  </div>
</template>
