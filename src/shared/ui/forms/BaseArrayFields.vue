<script setup lang="ts">
import { useFieldArray, type FieldEntry } from 'vee-validate';
import { computed, toRef, type PropType } from 'vue';
import { X } from '@lucide/vue';

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
	},
	max: { type: Number, default: null }
});

const name = toRef(props, 'name');

const { remove, push, fields } = useFieldArray(name);

const showAddButton = computed(() => {
	if (typeof props.max === 'number') {
		return fields.value.length < props.max;
	} else {
		return true;
	}
});

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

		<div v-for="(field, idx) in fields" :key="field.key">
			<component
				:is="
					renderField({
						index: idx,
						fieldName: `${name}[${idx}]`,
						field,
						remove
					})
				"
			>
				<template #actions>
					<button
						type="button"
						title="Удалить поле"
						@click="() => remove(idx)"
						class="absolute -top-2.5 -right-2.5 cursor-pointer rounded-full bg-red-500 p-1 text-white shadow-md transition-all hover:bg-red-600/95"
					>
						<X :width="20" :height="20" fill="white" />
					</button>
				</template>
			</component>
		</div>
		<button
			v-if="showAddButton"
			type="button"
			class="secondary-btn mt-1 w-fit"
			@click="handlePush"
		>
			{{ addButtonLabel }}
		</button>
	</div>
</template>
