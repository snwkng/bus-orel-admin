<script setup lang="ts">
import { Construction } from '@lucide/vue';
</script>
<template>
  <div class="flex h-full items-center justify-center">
    <div class="flex flex-col items-center gap-3 rounded-2xl bg-white px-12 py-10 text-center shadow-card">
      <Construction :size="40" class="text-deep-orange" />
      <h2 class="text-lg font-semibold text-slate-900">Страница в разработке</h2>
      <p class="max-w-sm text-sm text-slate-500">
        Раздел «Аренда микроавтобусов» пока недоступен. Мы работаем над ним.
      </p>
    </div>
  </div>
</template>
