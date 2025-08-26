<script setup lang="ts">
import { computed, toRef } from 'vue';
import type {
	IHotelRoomInfo,
	IDatesAndPrices
} from '@/entities/busTours/model/types';
import { BaseInput, BaseTextArea, TheDatePicker } from '@/shared/ui/forms';
import DatePriceRow from '@/shared/ui/forms/DatePriceRow.vue';
import { TrashIcon } from '@/shared/ui/icons';
import { FieldArray, useFieldArray } from 'vee-validate';

interface IHotelsInfo {
	name: string;
	values?: IHotelRoomInfo[];
}

const props = withDefaults(defineProps<IHotelsInfo>(), {
	values: () => [] as IHotelRoomInfo[]
});

const name = toRef(props, 'name');
</script>
<template>
	<div class="flex w-full flex-col gap-x-5 gap-y-2">
		<h4 class="font-bold">Номера и заезды</h4>
		<FieldArray :name="name" v-slot="{ fields, push, remove }">
			<div
				v-for="(field, idx) in fields"
				:key="field.key"
				class="flex flex-col gap-y-4 rounded-lg bg-white p-5"
			>
				<div class="flex w-full flex-row gap-x-5">
					<BaseInput
						:name="`${name}[${idx}].type`"
						label="Тип номера (стандарт, эконом и т.п.)"
						column
						:value="values[idx].type"
					/>
					<BaseInput
						:name="`${name}[${idx}].roomName`"
						label="Название номера"
						column
						:value="values[idx].roomName"
					/>
					<BaseInput
						:name="`${name}[${idx}].beds`"
						label="Количество спальных мест"
						type="number"
						column
						:value="values[idx].beds"
					/>
				</div>
				<BaseTextArea
					:name="`${name}[${idx}].description`"
					label="Описание того, что в номере"
					column
					:value="values[idx].description"
				/>
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
					<FieldArray
						:name="`${name}[${idx}].availability`"
						v-slot="{ fields, push, remove }"
					>
						<div
							class="flex w-full flex-row items-center justify-center gap-x-5"
							v-for="(item, index) in fields"
							:key="item.key"
						>
						{{ item }}
							<DatePriceRow
								:name="`${name}[${idx}].availability[${index}]`"
								:initial-value="(item as IDatesAndPrices)"
								@delete="remove(index)"
							/>
						</div>
						<div class="mt-2 flex">
							<button
								type="button"
								class="secondary-btn w-fit"
								@click.stop="push({})"
							>
								Добавить заезд
							</button>
						</div>
					</FieldArray>
				</div>
				<div class="flex w-full justify-end">
					<button
						type="button"
						class="delete-btn w-fit"
						@click.stop="remove(idx)"
					>
						Удалить номер
					</button>
				</div>
			</div>
			<button type="button" class="secondary-btn w-fit" @click.stop="push({})">
				Добавить номер
			</button>
		</FieldArray>
	</div>
</template>
