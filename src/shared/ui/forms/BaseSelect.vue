<script setup lang="ts">
defineOptions({
	inheritAttrs: false // Отключаем автоматическую передачу атрибутов
});

import { computed, nextTick, ref, toRef, useTemplateRef } from 'vue';

import { ChevronDown } from '@lucide/vue';
import { useField } from 'vee-validate';

export interface Props {
	name: string;
	list?: SelectItem[];
	label?: string;
	column?: boolean;
	multiple?: boolean;
	required?: boolean;
	width?: 'sm' | 'md' | 'lg' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
	list: () => [],
	width: 'lg'
});

const name = toRef(props, 'name');

const { value, errorMessage, meta, handleChange, validate } = useField<string | string[]>(
	name
);

const searchSelectRef = useTemplateRef('searchSelect')

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
	if (showSelect.value) {
		nextTick(() => {
			searchSelectRef.value?.focus()
		})
	}
};

const close = async () => {
	if (!showSelect.value) return
	await validate()
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
		<div :class="['flex w-full gap-x-5 gap-y-2', { 'flex-col': column }, `w-${width}`]">
			<label class="the-label" v-if="label" :for="name">
				{{ label }}
				<span class="text-red-600" v-if="required">*</span>
			</label>
			<div
				v-click-away="close"
				:id="name"
				class="relative mt-1 flex cursor-pointer items-center justify-between border rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
				:class="[
					{
						'border-red-500': ((meta.touched && !meta.valid) || errorMessage),
						'border-indigo-300 ring ring-indigo-200 ring-opacity-50 rounded-t-md rounded-b-none': showSelect
					},
				]"
			>
				<div
					class="flex min-h-10.5 w-full flex-wrap gap-2 px-3 py-2"
					@click="toggle"
				>
					<template v-if="currentValues.length">
						<div
							v-for="(val, idx) in currentValues"
							:key="idx"
							@click.stop="removeValue(idx)"
							class="rounded-lg border border-gray-200 bg-slate-100 px-2 py-1"
						>
							{{ val }}
						</div>
					</template>
				</div>
				<div
					class="absolute left-0 top-[calc(100%+2px)] z-10 w-full rounded-b-lg bg-white shadow-material-1"
					v-if="showSelect"
				>
					<div class="pb-2 pt-5">
						<div class="relative">
							<div class="px-2">
								<input
									ref="searchSelect"
									class="the-input w-full"
									name="searchSelect"
									placeholder="Поиск"
									v-model="inputValue"
									@keydown.enter.prevent.stop="add"
								/>
							</div>
							<button
								v-if="!searchableList.length"
								type="button"
								class="base-btn absolute right-0 top-0 z-10 mx-2 h-10.5 shadow-lg"
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
								class="p-2 hover:bg-slate-50"
								@click.stop="addToSelected(item)"
							>
								<span>{{ item.name }}</span>
							</div>
						</div>
					</div>
				</div>
				<ChevronDown
					class="transition-all w-8 stroke-slate-500"
					:class="{ 'rotate-180': showSelect }"
					@click="toggle"
				/>
			</div>
			<span
			:name="name"
			class="text-red-600"
			v-show="((meta.touched && !meta.valid) || errorMessage)"
		>
			{{ errorMessage }}
		</span>
		</div>
	</div>
</template>
