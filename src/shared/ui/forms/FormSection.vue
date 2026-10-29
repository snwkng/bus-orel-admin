<script setup lang="ts">
defineProps<{ title: string }>();
</script>
<template>
	<section class="rounded-2xl bg-white p-6 shadow-card">
		<h2 class="mb-4 text-lg font-semibold text-slate-800">{{ title }}</h2>
		<div class="flex flex-col gap-4">
			<slot />
		</div>
	</section>
</template>
