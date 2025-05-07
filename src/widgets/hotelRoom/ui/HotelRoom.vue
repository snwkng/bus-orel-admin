<script setup lang="ts">
import { computed } from 'vue';
import type {
	IHotelRoomInfo,
	IDatesAndPrices
} from '@/entities/busTours/model/types';

import FormField from '@/entities/formField/ui/FormField.vue';
import { TheInput, TheTextArea } from '@/shared/ui/forms';
import DatePriceRow from '@/shared/ui/forms/DatePriceRow.vue'

interface IHotelsInfo {
	hotelsInfo: IHotelRoomInfo[];
}

const props = defineProps<IHotelsInfo>();

const emit =
	defineEmits<(event: 'update', payload: IHotelRoomInfo[]) => void>();

const localData = computed({
	get: () => props.hotelsInfo,
	set: (value) => emit('update', value)
});

const addRow = (roomIndex: number) => {
	if (localData.value[roomIndex].datesAndPrices)
		localData.value[roomIndex].datesAndPrices.push({} as IDatesAndPrices);
};

const deleteRow = (index: number, roomIndex: number) => {
	if (localData.value[roomIndex].datesAndPrices)
		localData.value[roomIndex].datesAndPrices.splice(index, 1);
};

const addRoom = () => {
	localData.value.push({
		type: '',
		roomName: '',
		capacity: 0,
		inRoom: '',
		datesAndPrices: [{} as IDatesAndPrices]
	});
};

const deleteRoom = (roomIndex: number) => {
	if (localData.value[roomIndex]) {
		localData.value.splice(roomIndex, 1);
	}
};
</script>
<template>
	<div class="flex w-full flex-col gap-x-5 gap-y-2">
		<h4 class="font-bold">Номера и заезды</h4>
		<div
			class="flex flex-col gap-y-4 rounded-xl bg-white p-5"
			v-for="(hotel, roomIndex) in localData"
			:key="roomIndex"
		>
			<div class="flex w-full flex-row gap-x-5">
				<FormField
					name="typeRoom"
					label="Тип номера (стандарт, эконом и т.п.)"
					column
				>
					<TheInput name="typeRoom" type="text" v-model="hotel.type" />
				</FormField>
				<FormField name="roomName" label="Название номера" column>
					<TheInput name="roomName" type="text" v-model="hotel.roomName" />
				</FormField>
				<FormField name="capacity" label="Количество спальных мест" column>
					<TheInput name="capacity" type="number" v-model="hotel.capacity" />
				</FormField>
			</div>
			<FormField name="inRoom" label="Описание того, что в номере" column>
				<TheTextArea name="inRoom" type="text" v-model="hotel.inRoom" />
			</FormField>
			<div class="mt-2 flex w-full flex-col gap-x-5 gap-y-2">
				<h4 class="font-bold">Даты и цены номера</h4>
				<div class="flex w-full flex-row gap-x-5">
					<div class="w-full">
						<h3 class="the-label">Дата отправления</h3>
					</div>
					<div class="w-full">
						<h3 class="the-label">Дата приезда</h3>
					</div>
					<div class="w-full">
						<h3 class="the-label">Цена за номер</h3>
					</div>
					<div class="w-[42px]">
						<div class="h-full w-[42px]"></div>
					</div>
				</div>
				<div
					class="flex w-full flex-row items-center justify-center gap-x-5"
					v-for="(item, index) in hotel.datesAndPrices"
					:key="index"
				>
					<DatePriceRow :item="item" @delete="deleteRow(index, roomIndex)" />
				</div>
				<div class="mt-2 flex">
					<button
						type="button"
						class="secondary-btn w-fit"
						@click.stop="addRow(roomIndex)"
					>
						Добавить заезд
					</button>
				</div>
			</div>
			<div class="flex w-full justify-end">
				<button
					type="button"
					class="delete-btn w-fit"
					@click.stop="deleteRoom(roomIndex)"
				>
					Удалить номер
				</button>
			</div>
		</div>
		<button type="button" class="secondary-btn w-fit" @click.stop="addRoom">
			Добавить номер
		</button>
	</div>
</template>
