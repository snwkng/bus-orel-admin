<script setup lang="ts">
defineProps<{ title: string }>();
</script>
<template>
	<section class="py-6 first:pt-0 last:pb-0">
		<h2 class="mb-4 text-lg font-semibold text-slate-800">{{ title }}</h2>
		<div class="flex flex-col gap-4">
			<slot />
		</div>
	</section>
</template>
