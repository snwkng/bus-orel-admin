<script setup lang="ts" generic="T">
import { type ITableConfig } from '@/shared/config/interfaces/table.interface';
import { type IPagination } from '@/shared/config/interfaces/pagination.interface';
import { computed, isVNode, markRaw, useSlots } from 'vue';
import BasePagination from './BasePagination.vue';

const props = withDefaults(
	defineProps<{
		tableDataConfig: readonly ITableConfig<T>[]; // Конфиг для типа T
		tableData?: T[]; // Массив объектов типа T
		emptyText?: string;
		pagination: IPagination | null
	}>(),
	{
		tableDataConfig: () => [],
		tableData: () => [],
		emptyText: 'Здесь пусто...',
		pagination: null
	}
);

const slots = useSlots()

const tableHeader = computed(() => {
	console.log(!slots.actions)
	if (!slots.actions) return props.tableDataConfig
	return [...props.tableDataConfig, {label: 'Действия', propertyName: 'actions'}]
})

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

	return rawValue;
};

const RenderValue = (props: { value: any }) => {
	// Если это VNode или массив VNode, возвращаем как есть
	if (isVNode(props.value) || Array.isArray(props.value)) {
		return props.value;
	}
	// Если это примитив, оборачиваем в текстовый узел
	return String(props.value ?? '—');
};
</script>
<template>
	<div class="bg-white p-4 overflow-hidden w-full h-full rounded-xl">
		<div class="overflow-x-auto rounded-xl w-full h-full">
			<div
				class="grid min-w-[800px] bg-white md:min-w-full"
				:style="{
					gridTemplateColumns: tableHeader
						.map((c) => c.cellWidth || 'minmax(160px, 300px)')
						.join(' ')
				}"
			>
				<!-- Шапка таблицы -->
				<div
					v-for="config in tableHeader"
					:key="config.propertyName"
					class="border-b border-gray-300 bg-slate-100 p-4 font-bold text-slate-700"
					:class="{'sticky top-0 right-0': config.propertyName === 'actions'}"
				>
					{{ config.label }}
				</div>

				<!-- Тело таблицы -->
				<template v-for="(tableItem, idx) in tableData" :key="idx">
					<template
						v-for="config in tableHeader"
						:key="config.propertyName"
					>
						<div
							class="line-clamp-4 min-w-0 text-wrap bg-inherit p-4"
							:class="{
								'border-b border-gray-100': idx !== tableData.length - 1,
								'sticky top-0 right-0': config.propertyName === 'actions'
							}"
						>
							
							<div class="line-clamp-4 break-words">
								<slot v-if="config.propertyName === 'actions'" name="actions" :item="tableItem" />
								<slot
									v-else
									:name="`cell(${config.propertyName})`"
									:value="getValue(tableItem, config.propertyName)"
									:row="tableItem"
								>
									<RenderValue :value="getRenderedValue(tableItem, config)" />
								</slot>
							</div>
						</div>
					</template>
				</template>
			</div>
			<div class="sticky bottom-0 left-0 bg-white base-py base-px" v-if="pagination">
				<BasePagination :total="pagination.total" :limit="pagination.limit" :page="pagination.page" :last-page="pagination.lastPage" />
			</div>
		</div>
	</div>
</template>
