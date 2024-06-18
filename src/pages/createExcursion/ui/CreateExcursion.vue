<script setup lang="ts">
import { TheInput } from '@/shared/ui/forms';
import type { IExcursion } from '@/entities/excursions/model/types';
import { reactive } from 'vue';

const excursion: IExcursion = reactive({
  name: '',
  description: [],
  images: [],
  duration: 0,
  price: 0,
  hotelName: '',
  documentName: '',
  excursionStart: '',
  city: '',
  thePriceIncludes: [],
});

</script>
<template>
	<form class="flex flex-col gap-y-5">
		<TheInput
			label="Название экскурсии"
			:modelValue="excursion.name"
			@update:modelValue="($event) => (excursion.name = $event)"
		/>
		<TheInput
			label="Длительность экскурсии (в днях)"
			type="number"
			:modelValue="excursion.duration.toString()"
			@update:modelValue="($event) => (excursion.duration = Number($event))"
		/>
		<TheInput
			label="Город"
			:modelValue="excursion.city"
			@update:modelValue="($event) => (excursion.city = $event)"
		/>
		<TheInput
			label="Стоимость экскрусии"
			type="number"
			:modelValue="excursion.price.toString()"
			@update:modelValue="($event) => (excursion.price = Number($event))"
		/>
    <TheInput
			label="Дата отправления"
			type="date"
			:modelValue="excursion.excursionStart.toString()"
			@update:modelValue="($event) => (excursion.excursionStart = new Date($event))"
		/>
    <TheInput
			label="Название отеля (если есть)"
			:modelValue="excursion.hotelName"
			@update:modelValue="($event) => (excursion.hotelName = $event)"
		/>
	</form>
</template>
