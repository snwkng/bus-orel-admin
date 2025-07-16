<script setup lang="ts">
defineOptions({
	inheritAttrs: false // Отключаем автоматическую передачу атрибутов
});

import { computed, ref } from 'vue';

import { ArrowDown } from '@/shared/ui/icons';
import { TheInput } from '@/shared/ui/forms';
type SelectedType = SelectItem[] | SelectItem | string[] | string;
export interface Props {
	selected: SelectedType;
	list?: SelectItem[];
}

const props = withDefaults(defineProps<Props>(), {
	selected: () => [] as SelectItem[],
	list: () => []
});

const emit = defineEmits<{
	(event: 'addItem', payload: string | SelectItem): void;
	(event: 'removeItem', payload: string | SelectItem): void;
}>();

const showSelect = ref(false);
const inputValue = ref('');

const data = computed({
	get() {
		if (Array.isArray(props.selected)) {
			return props.selected.map((x: SelectItem | string, index: number) => ({
				id: typeof x === 'string' ? index : x.id,
				name: x
			})) as SelectItem[];
		} else {
			return [props.selected].map((x: SelectItem | string, index: number) => ({
				id: typeof x === 'string' ? index : x.id,
				name: x
			})) as SelectItem[];
		}
	},

	set(newValue: SelectItem) {
		emit('addItem', newValue?.name || '');
	}
});

const searchableList = computed(() => {
	if (inputValue.value) {
		return props.list.filter(
			(listItem: SelectItem) =>
				listItem.name?.toLowerCase().includes(inputValue.value.toLowerCase()) &&
				data.value.findIndex(
					(dataItem: SelectItem) =>
						dataItem?.name?.toLowerCase() === listItem?.name?.toLowerCase()
				) === -1
		);
	} else {
		return props.list.filter((listItem: SelectItem) => {
			const index = data.value.findIndex(
				(dataItem: SelectItem) =>
					dataItem.name?.toLocaleLowerCase() === listItem.name?.toLowerCase()
			);
			return index === -1;
		});
	}
});

const toggle = () => {
	showSelect.value = !showSelect.value;
};

const close = () => {
	showSelect.value = false;
};

const addToSelected = (item: SelectItem) => {
	data.value = item;
};

const removeItem = (item: SelectItem) => {
	emit('removeItem', item?.name || '');
};

const add = () => {
	if (inputValue.value) {
		emit('addItem', inputValue.value);
		inputValue.value = '';
	}
};
</script>
<template>
	<div v-click-away="close">
		<div
			class="relative mt-1 flex w-full cursor-pointer items-center justify-between rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			:class="[
				{ 'border-indigo-300 ring ring-indigo-200 ring-opacity-50': showSelect }
			]"
		>
			<div
				class="flex min-h-[42px] w-full flex-wrap gap-2 px-3 py-2"
				@click="toggle"
				@keydown.enter.stop="toggle"
			>
				<div
					v-if="data.length"
					v-for="item in data"
					:key="item.id"
					@click.stop="removeItem(item)"
					class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1"
				>
					{{ item.name }}
				</div>
			</div>
			<div
				class="absolute left-0 top-[calc(100%+10px)] z-10 w-full rounded-lg bg-white shadow-md"
				v-if="showSelect"
			>
				<div class="py-2">
					<div class="relative">
						<div class="px-2">
							<TheInput
								name="searchSelect"
								v-model.trim="inputValue"
								@keydown.enter.prevent.stop="add"
							/>
						</div>
						<button
							v-if="!searchableList.length"
							type="button"
							class="base-btn absolute right-0 top-0 z-10 mx-2 h-[42px] shadow-lg"
							@click.stop="add"
						>
							Добавить
						</button>
					</div>
					<div
						class="mt-2 max-h-52 overflow-y-auto"
						v-if="searchableList.length"
					>
						<div
							v-for="item in searchableList"
							:key="item.id"
							class="p-2 hover:bg-gray-50"
							@click.stop="addToSelected(item)"
						>
							<span>{{ item.name }}</span>
						</div>
					</div>
				</div>
			</div>
			<ArrowDown
				class="transition-all"
				:class="{ 'rotate-180': showSelect }"
				@click="toggle"
			/>
		</div>
	</div>
</template>
