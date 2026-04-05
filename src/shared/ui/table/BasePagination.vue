<script setup lang="ts">
import { type IPagination } from '@/shared/config/interfaces/pagination.interface';

defineProps<IPagination>()
</script>

<template>
  <div class="flex flex-row w-full">
    Всего {{ total }}
  </div>
</template>