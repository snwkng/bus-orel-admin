<script setup lang="ts">
import { useField, useFieldArray } from 'vee-validate';
import { ref, toRef } from 'vue';

import BaseInput from '@/shared/ui/forms/BaseInput.vue';
import BaseTextArea from '@/shared/ui/forms/BaseTextArea.vue';

interface IProps {
	name: string;
	label: string;
	addButtonLabel?: string;
	required?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
	required: false,
	addButtonLabel: 'Добавить'
});

const name = toRef(props, 'name');

const initialValue = ref({
	type: '',
	name: '',
	capacity: 0,
	inRoom: ''
});

const { remove, push, fields } = useFieldArray(name);
const { errorMessage, meta, errors } = useField<string>(name);
</script>
<template>
	<div class="flex flex-col gap-y-2">
		<div>
			<div
				:class="[
					'the-label',
					{ 'text-red-600': errors?.length && !meta.valid }
				]"
			>
				{{ label }}
				<span class="text-red-600" v-if="required"> * </span>
			</div>
			<span
				:name="name"
				class="text-red-600"
				v-show="errors?.length && !meta.valid"
			>
				{{ errorMessage }}
			</span>
		</div>
		<div class="rounded-md bg-white p-6">
			<div
				class="relative flex flex-col gap-y-4"
				v-for="(field, idx) in fields"
				:key="field.key"
			>
				<BaseInput
					:name="`${name}[${idx}].name`"
					label="Название номера"
					required
					column
				/>
				<BaseInput
					:name="`${name}[${idx}].type`"
					label="Тип номера"
					required
					column
				/>
				<BaseInput
					:name="`${name}[${idx}].capacity`"
					label="Количество спальных мест"
					required
					column
				/>
				<BaseTextArea
					:name="`${name}[${idx}].inRoom`"
					label="Что находится в номере"
					column
				/>

				<button
					type="button"
					title="Удалить номер"
					@click="() => remove(idx)"
					class="delete-btn w-fit"
				>
					Удалить номер
				</button>
			</div>
		</div>
		<button
			type="button"
			class="secondary-btn mt-1 w-fit"
			@click="push(initialValue)"
		>
			{{ addButtonLabel }}
		</button>
	</div>
</template>
