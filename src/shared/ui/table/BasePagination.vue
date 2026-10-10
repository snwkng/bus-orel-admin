<script setup lang="ts">
import { type IPagination } from '@/shared/config/interfaces/pagination.interface';
import { ChevronLeft, ChevronRight } from '@lucide/vue';

const props = defineProps<IPagination>();

const emit = defineEmits<{
	(e: 'update:page', value: number): void;
	(e: 'update:limit', value: number): void;
}>();
</script>

<template>
	<div class="flex w-full flex-row justify-end gap-5">
		<select
			:value="limit"
			@change="
				(e) =>
					emit('update:limit', Number((e.target as HTMLSelectElement).value))
			"
			class="rounded-lg border-gray-300"
		>
			<option :value="10">10</option>
			<option :value="20">20</option>
			<option :value="50">50</option>
		</select>

		<div class="flex flex-row items-center">
			<span>Страница: {{ page }} из {{ lastPage }}</span>
			<button
				type="button"
				:disabled="page === 1"
				 @click="emit('update:page', page - 1)"
			>
				<ChevronLeft />
			</button>
			<button
				type="button"
				:disabled="page === lastPage"
				 @click="emit('update:page', page + 1)"
			>
				<ChevronRight />
			</button>
		</div>
	</div>
</template>
