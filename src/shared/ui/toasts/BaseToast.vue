<script setup lang="ts">
import { useToast, type ToastItem } from '@/shared/config/composables/useToast';
const { toasts, remove } = useToast();

const getToastType = (type: ToastItem['type']) => {
	switch (type) {
		case 'success':
			return 'bg-green-300';
		case 'error':
			return 'bg-red-300';
		case 'info':
			return 'bg-blue-300';
	}
};
</script>

<template>
	<Teleport to="body">
		<div class="fixed right-5 top-5 z-[9999px] flex flex-col gap-2">
			<TransitionGroup name="list">
				<div
					v-for="toast in toasts"
					:key="toast.id"
					class="min-w-52 cursor-pointer rounded-xl px-5 py-3 text-white shadow-xl"
					:class="getToastType(toast.type)"
					@click="remove(toast.id)"
				>
					{{ toast.message }}
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>
<style scoped>
.list-enter-active,
.list-leave-active {
	transition: all 0.4s ease;
}
.list-enter-from {
	opacity: 0;
	transform: translateX(30px);
}
.list-leave-to {
	opacity: 0;
	transform: scale(0.9);
}
</style>
