<script setup lang="ts">
import { useFieldArray, type FieldEntry } from 'vee-validate';
import { toRef, type PropType } from 'vue';
import { CloseIcon } from '@/shared/ui/icons';

type ArrayItem = string | number | boolean | Record<string, any> | any[];
type InitialValue = ArrayItem | (() => ArrayItem);
type FieldItem = FieldEntry<unknown>;

const props = defineProps({
	name: { type: String, required: true },
	label: { type: String, required: true },
	addButtonLabel: { type: String, default: 'Добавить' },
	placeholder: { type: String, default: '' },
	renderField: {
		type: Function as PropType<
			(params: {
				index: number;
				fieldName: string;
				field: FieldItem;
				remove?: (idx: number) => void;
				push?: (data: [Object, String, Number]) => void;
				// опционально: remove, push — если нужны вложенные операции
			}) => any
		>,
		required: true
	},
	initialValue: {
		type: [Function, Object, String, Number, Array] as PropType<InitialValue>,
		default: () => ''
	}
});

const name = toRef(props, 'name');

const { remove, push, fields } = useFieldArray(name);

const handlePush = () => {
	if (typeof props.initialValue === 'function') {
		push(props.initialValue());
	} else {
		push(props.initialValue);
	}
};
</script>

<template>
	<div class="flex flex-col gap-y-4">
		<div class="the-label" v-if="!fields.length">{{ label }}</div>

		<div class="relative" v-for="(field, idx) in fields" :key="field.key">
			<component
				:is="
					renderField({
						index: idx,
						fieldName: `${name}[${idx}]`,
						field,
						remove
					})
				"
			/>

			<button
				type="button"
				title="Удалить поле"
				@click="() => remove(idx)"
				class="absolute right-[-10px] top-[-10px] rounded-full bg-red-500 p-2 text-white shadow-md transition-all hover:bg-red-600/95"
				:class="{ 'my-8': idx === 0 }"
			>
				<CloseIcon :width="16" :height="16" fill="white" />
			</button>
		</div>

		<button type="button" class="secondary-btn mt-1 w-fit" @click="handlePush">
			{{ addButtonLabel }}
		</button>
	</div>
</template>
