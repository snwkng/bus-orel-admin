<script setup lang="ts">
import FormField from '@/entities/formField/ui/FormField.vue';
import { TheInput, TheSelect, TheTextArea } from '@/shared/ui/forms';
import { ref } from 'vue';

const formData = ref('');
const formData2 = ref('');
const formData3 = ref('');

const selectModel = ref<SelectItem[]>([
	{ id: 'asdasdasda', name: 'Селект1' },
	{ id: 'asdasdasdaa', name: 'Селект2' }
]);

const selectModelValues = ref<SelectItem[]>([]);
</script>
<template>
	<div class="flex flex-col gap-y-5 mt-5 px-5">
		<div>Hello! (test pm2 start after deploy)</div>
		<FormField name="input1" label="Тестовый label">
			<TheInput
				name="input1"
				type="text"
				placeholder="asdasda"
				v-model="formData"
			/>
		</FormField>
		<FormField name="input2" label="Тестовый label" column>
			<TheInput
				name="input2"
				type="number"
				placeholder="asdasda"
				v-model="formData2"
			/>
		</FormField>
		<FormField name="input3" label="Тестовый label" column>
			<TheSelect
				name="input3"
				label="Город"
				:selected="selectModelValues"
				:list="selectModel"
				@update="($event: SelectItem[]) => (selectModelValues = $event as SelectItem[])"
			/>
		</FormField>
		<FormField name="textarea" label="Тестовый label textarea" column>
			<TheTextArea
				name="textarea"
				placeholder="textarea"
				v-model="formData3"
			/>
		</FormField>
	</div>
</template>
