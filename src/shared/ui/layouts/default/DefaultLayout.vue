<script setup lang="ts">
import TheNavbar from '@/shared/ui/navbar';
import TheHeader from '@/shared/ui/header';
</script>
<template>
	<div class="flex">
		<TheNavbar />
		<div class="flex-1 flex-col overflow-auto">
			<TheHeader />
			<main
				class="h-[calc(100vh-96px)] overflow-hidden rounded-tl-lg bg-slate-200 transition-all"
			>
				<slot />
			</main>
		</div>
	</div>
</template>
