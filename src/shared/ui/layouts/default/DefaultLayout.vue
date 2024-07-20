<script setup lang="ts">
import TheNavbar from '@/shared/ui/navbar';
import TheHeader from '@/shared/ui/header';
</script>
<template>
	<div class="flex h-[100vh]">
		<TheNavbar />
		<div class="flex-1 flex-col overflow-auto">
			<TheHeader />
			<main class="bg-slate-200 px-6 py-6 transition-all">
				<slot />
			</main>
		</div>
	</div>
</template>
