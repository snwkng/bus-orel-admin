<script setup lang="ts">
import TheNavbar from '@/shared/ui/navbar';
import TheHeader from '@/shared/ui/header';
</script>
<template>
	<div class="flex">
		<TheNavbar />
		<div class="w-full max-w-[calc(100vw-300px)]">
			<TheHeader />
			<main class="min-h-[calc(100vh-80px)] bg-slate-200 px-6 py-6">
				<slot />
			</main>
		</div>
	</div>
</template>
