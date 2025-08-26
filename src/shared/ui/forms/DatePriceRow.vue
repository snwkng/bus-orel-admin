<script setup lang="ts">
import { defineProps, defineEmits, toRef } from 'vue';
import { BaseInput, TheDatePicker } from '@/shared/ui/forms';
import { TrashIcon } from '@/shared/ui/icons';
import type { IDatesAndPrices } from '@/entities/busTours/model/types';

interface IProps {
	name: string;
	initialValue?: IDatesAndPrices;
}

const props = defineProps<IProps>();

const name = toRef(props, 'name');

const emit = defineEmits<(e: 'delete') => void>();

const handleDelete = () => {
	emit('delete');
};
</script>

<template>
	<div class="flex w-full flex-row items-center justify-center gap-x-5">
		<TheDatePicker
			:name="`${name}.startDate`"
			column
			:value="initialValue?.startDate?.toString()"
		/>
		<TheDatePicker
			:name="`${name}.endDate`"
			column
			:value="initialValue?.endDate?.toString()"
		/>
		<BaseInput
			:name="`${name}.pricePerPerson`"
			type="number"
			column
			:value="initialValue?.pricePerPerson"
		/>
		<div
			class="mt-2 flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-lg bg-slate-200 p-2 transition-all hover:scale-110 hover:bg-slate-300"
			title="удалить"
			@click="handleDelete"
		>
			<TrashIcon fill="red" :width="32" :height="32" />
		</div>
	</div>
</template>
