<script setup lang="ts">
	import { TheNavbar } from '@/features/navbar';
	import { TheHeader } from '@/features/header';
</script>
<template>
	<div class="flex h-screen overflow-hidden bg-slate-100">
		<TheNavbar />
		<div class="flex min-w-0 flex-1 flex-col">
			<TheHeader />
			<main class="base-px base-py min-h-0 flex-1 overflow-hidden">
				<slot />
			</main>
		</div>
	</div>
</template>
