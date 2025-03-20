<script setup lang="ts">
import TheNavbar from '@/shared/ui/navbar';
import TheHeader from '@/shared/ui/header';
</script>
<template>
	<div class="flex">
		<TheNavbar />
		<div class="flex-1 flex-col overflow-auto">
			<TheHeader />
			<main class="bg-slate-200 rounded-tl-lg transition-all h-[calc(100vh-80px)] overflow-hidden">
				<slot />
			</main>
		</div>
	</div>
</template>
