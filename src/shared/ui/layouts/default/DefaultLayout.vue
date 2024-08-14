<script setup lang="ts">
import TheNavbar from '@/shared/ui/navbar';
import TheHeader from '@/shared/ui/header';
</script>
<template>
	<div class="flex">
		<TheNavbar />
		<div class="flex-1 flex-col overflow-auto">
			<TheHeader />
			<main class="bg-slate-200 px-6 py-6 rounded-tl-lg transition-all min-h-[calc(100vh-80px)]">
				<slot />
			</main>
		</div>
	</div>
</template>
