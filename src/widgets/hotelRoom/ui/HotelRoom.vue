<script setup lang="ts">
import { ref } from 'vue';
import type {
	IHotelRoomInfo,
	IDatesAndPrices
} from '@/entities/busTours/model/types';

import { TheInput, TheTextArea } from '@/shared/ui/forms';

const props = defineProps<IHotelRoomInfo>();

const localData = ref({
	type: props?.type || '',
	roomName: props?.roomName || '',
	capacity: props?.capacity || 0,
	inRoom: props?.inRoom || '',
	datesAndPrices: props.datesAndPrices
		? [...props.datesAndPrices]
		: [{} as IDatesAndPrices]
});

const addTemplate = () => {
  localData.value.datesAndPrices.push({} as IDatesAndPrices)
}
</script>
<template>
	<div class="">
		<h4 class="font-bold">
			Добавление / Редактирование дат заезда и информации о номерах
		</h4>
		<div>
			<TheInput
				label="Тип номера (стандарт, эконом и т.п.)"
				v-model="localData.type"
			/>
			<TheInput label="Название номера" v-model="localData.roomName" />
			<TheInput
				label="Количество спальных мест"
				:modelValue="localData.capacity.toString()"
				@update:modelValue="($event) => (localData.capacity = Number($event))"
			/>
			<TheTextArea
				label="Описание того, что в номере"
				v-model="localData.inRoom"
			/>
			<div class="mt-2">
				<h4 class="font-bold">Даты и цены номера</h4>
				<div
					class="flex w-full flex-row gap-x-5"
					v-for="(item, index) in localData.datesAndPrices"
					:key="index"
				>
					<TheInput
						class="w-full"
						label="Дата отправления"
						type="date"
						:modelValue="item?.startDate?.toString()"
						@update:modelValue="($event) => (item.startDate = $event)"
					/>
					<TheInput
						class="w-full"
						label="Дата приезда"
						type="date"
						:modelValue="item?.endDate?.toString()"
						@update:modelValue="($event) => (item.endDate = $event)"
					/>
					<TheInput
						class="w-full"
						label="Цена за номер"
						:modelValue="item?.price?.toString()"
						@update:modelValue="($event) => (item.price = Number($event))"
					/>
				</div>
        <button type="button" class="base-btn" @click.stop="addTemplate">Добавить заезд</button>
			</div>
		</div>
	</div>
</template>
