<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ru } from 'date-fns/locale';

const model = defineModel<Date[] | string[]>();
</script>

<template>
	<VueDatePicker
		v-model="model"
		:format-locale="ru"
		multi-dates
		:enable-time-picker="false"
		format="dd MMMM yyyy"
	>
		<template #action-row="{ selectDate }">
			<button class="secondary-btn w-full" @click.stop.prevent="selectDate">
				Выбрать даты
			</button>
		</template>
	</VueDatePicker>
</template>
