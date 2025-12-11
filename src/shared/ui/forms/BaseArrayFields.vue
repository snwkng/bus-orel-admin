<script setup lang="ts">
import { useFieldArray } from 'vee-validate';
import { toRef, type PropType } from 'vue';
import { CloseIcon } from '@/shared/ui/icons';

const props = defineProps({
	name: { type: String, required: true },
	label: { type: String, required: true },
	addButtonLabel: { type: String, default: 'Добавить' },
	placeholder: { type: String, default: '' },
	renderField: {
		type: Function as PropType<(idx: number, fieldName: string) => any>,
		required: true
	}
});

const name = toRef(props, 'name');

const { remove, push, fields } = useFieldArray(name);
</script>

<template>
	<div class="flex flex-col gap-y-4">
		<div class="the-label" v-if="!fields.length">{{ label }}</div>
		<div class="relative" v-for="(field, idx) in fields" :key="field.key">
			<component :is="renderField(idx, `${name}[${idx}]`)" />
			<button
				type="button"
        title="Удалить поле"
				@click="remove(idx)"
				class="absolute right-[-10px] top-[-10px] rounded-full transition-all bg-red-500 p-2 text-white shadow-md hover:bg-red-600/95"
				:class="{ 'my-8': idx === 0 }"
			>
				<CloseIcon :width="16" :height="16" fill="white" />
			</button>
		</div>
		<button type="button" class="secondary-btn mt-1 w-fit" @click="push('')">
			{{ addButtonLabel }}
		</button>
	</div>
</template>
