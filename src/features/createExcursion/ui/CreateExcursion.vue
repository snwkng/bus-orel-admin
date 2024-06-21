<script setup lang="ts">
import dayjs from 'dayjs';
import { TheInput, TheTextArea } from '@/shared/ui/forms';
import type { IExcursion } from '@/entities/excursions/model/types';
import { reactive, watch } from 'vue';
import DragAndDrop from '@/shared/ui/dragAndDrop';

const excursion: IExcursion = reactive({
  name: '',
  description: Array.from({ length: 1 }),
  images: [],
  duration: 0,
  price: 0,
  hotelName: '',
  documentName: '',
  excursionStart: '',
  city: '',
  thePriceIncludes: Array.from({ length: 1 }),
});

watch(() => excursion.duration, () => {
  excursion.description = Array.from({ length: excursion.duration });
})

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
			@update:modelValue="($event) => (excursion.excursionStart = dayjs($event).format('YYYY-MM-DD'))"
		/>
    <TheInput
			label="Название отеля (если есть)"
			:modelValue="excursion.hotelName"
			@update:modelValue="($event) => (excursion.hotelName = $event)"
		/>

    <div class="flex flex-col items-start w-full">
      <div class="text-gray-700 mb-1">Программа экскурсии</div>
      <div class="w-full flex flex-col gap-y-2">
        <TheTextArea
          v-for="(inc, index) in excursion.description" :key="index"

          :placeholder="`День ${index + 1}`"
          :modelValue="inc"
          @update:modelValue="($event) => (excursion.description[index] = $event)"
        />
      </div>
      <button type="button" class="mt-3 base-btn" @click="() => excursion.description.push('')">Добавить день</button>
    </div>

    <div class="flex flex-col items-start w-full">
      <div class="text-gray-700 mb-1">В стоимость включено</div>
      <div class="w-full flex flex-col gap-y-2">
        <TheTextArea
          v-for="(inc, index) in excursion.thePriceIncludes" :key="index"
          :placeholder="`Опция ${index + 1}`"
          :modelValue="inc"
          @update:modelValue="($event) => (excursion.thePriceIncludes[index] = $event)"
        />
      </div>
      <button type="button" class="mt-3 base-btn" @click="() => excursion.thePriceIncludes.push('')">Добавить поле</button>
    </div>

    <DragAndDrop />
	</form>
</template>
