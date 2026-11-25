<script setup lang="ts">
defineProps<{
	open: boolean;
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
}>();

const emit = defineEmits<{
	(e: 'confirm'): void;
	(e: 'cancel'): void;
}>();
</script>
<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="open"
				class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
				@click.self="emit('cancel')"
			>
				<div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card">
					<h3 v-if="title" class="mb-2 text-lg font-semibold text-slate-900">
						{{ title }}
					</h3>
					<p class="mb-6 text-sm text-slate-600">{{ message }}</p>
					<div class="flex justify-end gap-3">
						<button
							type="button"
							class="cursor-pointer rounded-lg px-4 py-2 font-semibold text-slate-600 transition-colors hover:bg-slate-100"
							@click="emit('cancel')"
						>
							{{ cancelText ?? 'Отмена' }}
						</button>
						<button type="button" class="delete-btn cursor-pointer" @click="emit('confirm')">
							{{ confirmText ?? 'Удалить' }}
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
