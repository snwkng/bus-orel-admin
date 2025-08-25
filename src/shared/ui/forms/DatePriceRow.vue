<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import FormField from '@/entities/formField/ui/FormField.vue';
import { BaseInput, TheDatePicker } from '@/shared/ui/forms';
import { TrashIcon } from '@/shared/ui/icons';
import type { IDatesAndPrices } from '@/entities/busTours/model/types';

interface IProps {
	item: IDatesAndPrices;
}

const props = defineProps<IProps>();
const emit = defineEmits<(e: 'delete') => void>();

const handleDelete = () => {
	emit('delete');
};
</script>

<template>
	<div class="flex w-full flex-row items-center justify-center gap-x-5">
		<FormField :name="`startDate-${item.startDate}`" column>
			<TheDatePicker v-model="item.startDate" />
		</FormField>
		<FormField :name="`endDate-${item.endDate}`" column>
			<TheDatePicker v-model="item.endDate" />
		</FormField>
		<FormField :name="`price-${item.pricePerPerson}`" column>
			<BaseInput type="number" v-model="item.pricePerPerson" />
		</FormField>
		<div
			class="mt-2 flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-lg bg-slate-200 p-2 transition-all hover:scale-110 hover:bg-slate-300"
			title="удалить"
			@click="handleDelete"
		>
			<TrashIcon fill="red" :width="32" :height="32" />
		</div>
	</div>
</template>
