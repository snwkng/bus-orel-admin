<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
	label: string;
	value: number | null;
	icon: Component;
	iconClass: string;
	loading?: boolean;
}>();
</script>
<template>
	<div class="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card">
		<div
			class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
			:class="iconClass"
		>
			<component :is="icon" :size="22" />
		</div>
		<div class="min-w-0">
			<div class="text-2xl font-semibold text-slate-900">
				<span v-if="loading" class="text-slate-300">…</span>
				<template v-else>{{ value }}</template>
			</div>
			<div class="truncate text-sm text-slate-500">{{ label }}</div>
		</div>
	</div>
</template>
