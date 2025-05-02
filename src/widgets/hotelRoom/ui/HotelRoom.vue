<script setup lang="ts">
import { ref, watch } from 'vue';
import type {
	IHotelRoomInfo,
	IDatesAndPrices
} from '@/entities/busTours/model/types';

import FormField from '@/entities/formField/ui/FormField.vue';
import { TheInput, TheTextArea, TheDatePicker } from '@/shared/ui/forms';
import { TrashIcon } from '@/shared/ui/icons';

interface IHotelsInfo {
	hotelsInfo: IHotelRoomInfo[];
}

const props = defineProps<IHotelsInfo>()

const emit =
	defineEmits<(event: 'update', payload: IHotelRoomInfo[]) => void>();

const localData = ref([...props.hotelsInfo]);

watch(
	localData,
	(newVal) => {
		emit('update', newVal);
	},
	{ deep: true }
);

const addRow = (hotelIndex: number) => {
	localData.value[hotelIndex].datesAndPrices.push({} as IDatesAndPrices);
};

const deleteRow = (index: number, hotelindex: number) => {
	localData.value[hotelindex].datesAndPrices.splice(index, 1);
};

const addHotel = () => {
	localData.value.push({
		type: '',
		roomName: '',
		capacity: 0,
		inRoom: '',
		datesAndPrices: [{} as IDatesAndPrices]
	});
};
</script>
<template>
	<div class="flex w-full flex-col gap-x-5 gap-y-2">
		<h4 class="font-bold">Номера и заезды</h4>
		<div
			class="flex flex-col gap-y-4 rounded-xl bg-white p-5"
			v-for="(hotel, hotelIndex) in localData"
			:key="hotelIndex"
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
					<FormField :name="`startDate-${index}`" column>
						<TheDatePicker
							:name="`startDate-${index}`"
							v-model="item.startDate"
						/>
					</FormField>
					<FormField :name="`endDate-${index}`" column>
						<TheDatePicker :name="`endDate-${index}`" v-model="item.endDate" />
					</FormField>
					<FormField :name="`price-${index}`" column>
						<TheInput
							:name="`price-${index}`"
							type="number"
							v-model="item.price"
						/>
					</FormField>
					<div
						class="mt-2 flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-xl bg-slate-200 p-2"
						title="удалить"
						@click="deleteRow(index, hotelIndex)"
					>
						<TrashIcon fill="red" :width="32" :height="32" />
					</div>
				</div>
				<div class="mt-2 flex">
					<button
						type="button"
						class="secondary-btn w-fit"
						@click.stop="addRow(hotelIndex)"
					>
						Добавить заезд
					</button>
				</div>
			</div>
		</div>
		<button type="button" class="secondary-btn w-fit" @click.stop="addHotel">
			Добавить номер
		</button>
	</div>
</template>
