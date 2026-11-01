<script setup lang="ts">
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from '@lucide/vue';

interface SortOption {
	value: string;
	label: string;
}

withDefaults(
	defineProps<{
		search?: string;
		withSearch?: boolean;
		searchPlaceholder?: string;
		sortBy: string;
		sortDir: string;
		sortOptions: SortOption[];
	}>(),
	{
		search: '',
		withSearch: false,
		searchPlaceholder: 'Поиск'
	}
);

const emit = defineEmits<{
	(e: 'update:search', value: string): void;
	(e: 'update:sortBy', value: string): void;
	(e: 'update:sortDir', value: string): void;
}>();

const onSearchInput = (event: Event) => {
	emit('update:search', (event.target as HTMLInputElement).value);
};
</script>
<template>
	<div class="flex flex-wrap items-center gap-3">
		<div v-if="withSearch" class="relative w-full sm:w-72">
			<Search
				:size="16"
				class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
			/>
			<input
				type="text"
				:value="search"
				:placeholder="searchPlaceholder"
				class="the-input pl-9"
				@input="onSearchInput"
			/>
		</div>
		<div class="flex items-center gap-2">
			<label class="text-sm text-slate-500" for="table-sort">Сортировка</label>
			<select
				id="table-sort"
				:value="sortBy"
				class="the-input w-auto pr-8"
				@change="emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
			>
				<option v-for="option in sortOptions" :key="option.value" :value="option.value">
					{{ option.label }}
				</option>
			</select>
			<button
				type="button"
				class="cursor-pointer rounded-lg border border-slate-300 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
				:title="sortDir === 'asc' ? 'По возрастанию' : 'По убыванию'"
				@click="emit('update:sortDir', sortDir === 'asc' ? 'desc' : 'asc')"
			>
				<ArrowUpNarrowWide v-if="sortDir === 'asc'" :size="18" />
				<ArrowDownWideNarrow v-else :size="18" />
			</button>
		</div>
	</div>
</template>
