<script setup lang="ts">
defineOptions({
	inheritAttrs: false // Отключаем автоматическую передачу атрибутов
});

import { computed, ref, toRef } from 'vue';

import { ArrowDown } from '@/shared/ui/icons';
import { useField } from 'vee-validate';

export interface Props {
	name: string;
	list?: SelectItem[];
	label?: string;
	column?: boolean;
	multiple?: boolean;
	required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	list: () => []
});

const name = toRef(props, 'name');

const { value, errorMessage, meta, handleChange } = useField<string | string[]>(
	name
);

const showSelect = ref(false);
const inputValue = ref('');

const searchableList = computed(() => {
	return props.list.filter((listItem: SelectItem) => {
		// Проверяем, нет ли уже этого элемента в выбранных
		const isSelected = currentValues.value.includes(listItem?.name ?? '');

		if (inputValue.value) {
			return (
				!isSelected &&
				listItem.name?.toLowerCase().includes(inputValue.value.toLowerCase())
			);
		}
		return !isSelected;
	});
});

const toggle = () => {
	showSelect.value = !showSelect.value;
};

const close = () => {
	inputValue.value = '';
	showSelect.value = false;
};

const currentValues = computed(() => {
	if (!value.value) return [];
	return Array.isArray(value.value) ? value.value : [value.value];
});

const addToSelected = (item: SelectItem) => {
	if (props.multiple) {
		const newValue = [...currentValues.value, item.name];
		handleChange(newValue);
	} else {
		handleChange(item.name);
		close();
	}
};

const removeValue = (index: number) => {
    if (props.multiple) {
        const newValue = [...currentValues.value];
        newValue.splice(index, 1);
        handleChange(newValue);
    } else {
        handleChange(undefined);
    }
};

const add = () => {
	if (inputValue.value) {
		if (props.multiple) {
			const newValue = [...currentValues.value, inputValue.value]
			handleChange(newValue);
		} else {
			handleChange(inputValue.value);
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
				<span class="text-red-600" v-if="required">*</span>
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
				>
					<template v-if="currentValues.length">
						<div
							v-for="(val, idx) in currentValues"
							:key="idx"
							@click.stop="removeValue(idx)"
							class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1"
						>
							{{ val }}
						</div>
					</template>
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
