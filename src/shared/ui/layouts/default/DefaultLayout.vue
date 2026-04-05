<script setup lang="ts">
import { TheNavbar } from '@/features/navbar';
import { TheHeader } from '@/features/header';
</script>
<template>
	<div class="flex overflow-hidden rounded-xl bg-gray-200">
		<TheNavbar />
		<div class="flex-1 flex-col overflow-auto">
			<TheHeader />
			<div class="h-[calc(100vh-70px)] bg-white">
				<main
					class="base-px base-py h-full overflow-hidden rounded-xl bg-gray-200 transition-all"
				>
					<slot />
				</main>
			</div>
		</div>
	</div>
</template>
