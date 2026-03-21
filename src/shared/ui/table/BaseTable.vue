<script setup lang="ts" generic="T extends ITableConfig">
import { type ITableConfig } from '@/shared/config/interfaces/table.interface';
// import dayjs from 'dayjs';

import { ref, watch, h, type VNode, isVNode, markRaw } from 'vue';
// import { TrashIcon, EditIcon } from '@/shared/ui/icons';

const props = withDefaults(
	defineProps<{
		tableDataConfig: readonly ITableConfig<T>[]; // Конфиг для типа T
		tableData?: T[]; // Массив объектов типа T
		showActions?: boolean;
		emptyText?: string;
	}>(),
	{
		tableDataConfig: () => [],
		tableData: () => [],
		showActions: true,
		emptyText: 'Здесь пусто...'
	}
);

const emit = defineEmits(['edit', 'delete']);

const loading = ref(true);

watch(
	() => props.tableData,
	() => {
		loading.value = false;
	}
);

const getValue = (obj: T, path: string): any => {
	if (!path) return obj;

	return path.split('.').reduce((acc: any, part: string) => {
		// Проверяем, что аккамулятор существует и является объектом
		if (acc && typeof acc === 'object' && part in acc) {
			return acc[part];
		}
		return undefined;
	}, obj);
};

// Функция рендеринга
const getRenderedValue = (row: T, col: ITableConfig<T>): any => {
	const rawValue = getValue(row, col.propertyName);

	if (col.format) {
		const rendered = col.format(rawValue, row);
		// Обязательно помечаем объект как Raw, если это VNode (объект)
		return rendered && typeof rendered === 'object'
			? markRaw(rendered)
			: rendered;
	}

	return rawValue ?? '—';
};

const RenderValue = (props: { value: any }) => {
	// Если это VNode или массив VNode, возвращаем как есть
	if (isVNode(props.value) || Array.isArray(props.value)) {
		return props.value;
	}
	// Если это примитив, оборачиваем в текстовый узел
	return String(props.value ?? '—');
};

const editAction = (id: string) => {
	emit('edit', id);
};

const deleteAction = (id: string) => {
	emit('delete', id);
};
</script>
<template>
	<div class="overflow-x-auto rounded-xl border">
		<div
			class="grid min-w-[800px] bg-white md:min-w-full"
			:style="{
				gridTemplateColumns: tableDataConfig
					.map((c) => c.cellWidth || '1fr')
					.join(' ')
			}"
		>
			<!-- Шапка таблицы -->
			<div
				v-for="config in tableDataConfig"
				:key="config.propertyName"
				class="border-b border-gray-300 bg-slate-100 p-4 font-bold text-slate-700"
			>
				{{ config.label }}
			</div>

			<!-- Тело таблицы -->
			<template v-for="(tableItem, idx) in tableData" :key="idx">
				<template v-for="config in tableDataConfig" :key="config.propertyName">
					<div
						class="line-clamp-4 min-w-0 text-wrap bg-inherit p-4"
						:class="{
							'border-b border-gray-100': idx !== tableData.length - 1
						}"
					>
						<div class="line-clamp-4 break-words">
							<slot
								:name="`cell(${config.propertyName})`"
								:value="getValue(tableItem, config.propertyName)"
								:row="tableItem"
							>
								<!-- Используем наш мини-компонент -->
								<RenderValue :value="getRenderedValue(tableItem, config)" />
							</slot>
						</div>
					</div>
				</template>
			</template>
		</div>
	</div>
</template>
