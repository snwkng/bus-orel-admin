<script setup lang="ts">
defineOptions({
	inheritAttrs: false // Отключаем автоматическую передачу атрибутов
});

import { computed, ref, toRef } from 'vue';

import { ArrowDown } from '@/shared/ui/icons';
import type { StringSchema } from 'yup';
import { useFieldArray } from 'vee-validate';

export interface Props {
	name: string;
	selected: string[];
	list?: SelectItem[];
	label?: string;
	validator?: StringSchema<string>;
	column?: boolean;
	multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	selected: () => [] as string[],
	list: () => []
});

const name = toRef(props, 'name');

const { remove, push, replace, fields } = useFieldArray(name.value.toString());

const showSelect = ref(false);
const inputValue = ref('');

const searchableList = computed(() => {
	const filedsVal = fields.value.map((x: any) => x.value)
	if (inputValue.value) {
		return props.list.filter(
			(listItem: SelectItem) =>
				listItem.name?.toLowerCase().includes(inputValue.value.toLowerCase()) &&
				filedsVal?.findIndex(
					(dataItem: string) =>
						dataItem?.toLowerCase() === listItem?.name?.toLowerCase()
				) === -1
		);
	} else {
		return props.list.filter((listItem: SelectItem) => {
			const index = filedsVal.findIndex(
				(dataItem: string) =>
					dataItem?.toLocaleLowerCase() === listItem.name?.toLowerCase()
			);
			return index === -1;
		});
	}
});

const toggle = () => {
	showSelect.value = !showSelect.value;
};

const close = () => {
	inputValue.value = '';
	showSelect.value = false;
};

const addToSelected = (item: SelectItem) => {
	if (props.multiple) {
		push(item.name);
	} else {
		replace([item.name]);
	}
};

const add = () => {
	if (inputValue.value) {
		if (props.multiple) {
			push(inputValue.value);
		} else {
			replace([inputValue.value]);
		}
		inputValue.value = '';
	}
};
</script>
<template>
	<div>
		<div :class="['flex w-full gap-x-5 gap-y-2', { 'flex-col': column }]">
			<label class="the-label" v-if="label" :for="name">
				{{ label }}
				<span
					class="text-red-600"
					v-if="validator?.describe().tests?.some((x) => x.name === 'required')"
					>*</span
				>
			</label>
			<div
				v-click-away="close"
				class="relative mt-1 flex w-full cursor-pointer items-center justify-between rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
				:class="[
					{
						'border-indigo-300 ring ring-indigo-200 ring-opacity-50': showSelect
					}
				]"
			>
				<div
					class="flex min-h-[42px] w-full flex-wrap gap-2 px-3 py-2"
					@click="toggle"
					@keydown.enter.stop="toggle"
				>
					<div
						v-for="(item, idx) in fields"
						:key="item.key"
						@click.stop="remove(idx)"
						class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1"
					>
						{{ item?.value }}
					</div>
				</div>
				<div
					class="absolute left-0 top-[calc(100%+10px)] z-10 w-full rounded-lg bg-white shadow-md"
					v-if="showSelect"
				>
					<div class="py-2">
						<div class="relative">
							<div class="px-2">
								<input
									class="the-input"
									name="searchSelect"
									v-model="inputValue"
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
	</div>
</template>
