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
		pagination?: IPagination | null;
		stickyHeader?: boolean;
		clickableRows?: boolean;
		filters?: Record<string, unknown>;
	}>(),
	{
		tableDataConfig: () => [],
		tableData: () => [],
		emptyText: 'Здесь пусто...',
		pagination: null,
		stickyHeader: false,
		clickableRows: false
	}
);

const emit = defineEmits<{
	(e: 'update-filters', data: Record<string, unknown>): void;
	(e: 'row-click', row: T): void;
}>();

const slots = useSlots();

const tableHeader = computed(() => {
	if (!slots.actions) return props.tableDataConfig;
	return [
		...props.tableDataConfig,
		{ label: 'Действия', propertyName: 'actions', cellWidth: '110px' }
	];
});

const getRowKey = (row: T, idx: number): string | number => {
	if (row && typeof row === 'object' && '_id' in row) {
		return String((row as { _id: unknown })._id);
	}
	return idx;
};

const getValue = (obj: T, path: string): unknown => {
	if (!path) return obj;

	return path.split('.').reduce<unknown>((acc, part: string) => {
		// Проверяем, что аккамулятор существует и является объектом
		if (acc && typeof acc === 'object' && part in acc) {
			return (acc as Record<string, unknown>)[part];
		}
		return undefined;
	}, obj);
};

// Функция рендеринга
const getRenderedValue = (row: T, col: ITableConfig<T>): unknown => {
	const rawValue = getValue(row, col.propertyName);

	if (col.format) {
		const rendered = col.format(rawValue as never, row);
		// Обязательно помечаем объект как Raw, если это VNode (объект)
		return rendered && typeof rendered === 'object'
			? markRaw(rendered)
			: rendered;
	}

	return rawValue;
};

const RenderValue = (props: { value: unknown }) => {
	// Если это VNode или массив VNode, возвращаем как есть
	if (isVNode(props.value) || Array.isArray(props.value)) {
		return props.value;
	}
	// Если это примитив, оборачиваем в текстовый узел
	return String(props.value ?? '—');
};

const onRowClick = (row: T) => {
	if (props.clickableRows) emit('row-click', row);
};

const updateFilters = (data: Record<string, unknown>) => {
	emit('update-filters', data);
};
</script>
<template>
	<div
		class="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-card"
	>
		<div class="h-full w-full overflow-x-auto">
			<!-- шапка таблицы -->
			<div
				class="z-10 grid bg-white md:min-w-full"
				:class="{
					'sticky top-0': stickyHeader
				}"
				:style="{
					gridTemplateColumns: tableHeader
						.map((c) => c.cellWidth || 'minmax(140px, 1fr)')
						.join(' ')
				}"
			>
				<div
					v-for="config in tableHeader"
					:key="config.propertyName"
					class="flex items-center border-b border-slate-200 bg-white px-4 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase"
					:class="{
						'sticky right-0 top-0 shadow-rounded-left':
							config.propertyName === 'actions'
					}"
				>
					{{ config.label }}
				</div>
			</div>

			<!-- Тело таблицы -->
			<div
				class="grid bg-white md:min-w-full"
				:style="{
					gridTemplateColumns: tableHeader
						.map((c) => c.cellWidth || 'minmax(140px, 1fr)')
						.join(' ')
				}"
			>
				<div
					v-if="!tableData.length"
					class="col-span-full px-4 py-12 text-center text-sm text-slate-400"
				>
					{{ emptyText }}
				</div>
				<div
					v-for="(tableItem, idx) in tableData"
					:key="getRowKey(tableItem, idx)"
					class="group/row contents"
					:class="{ 'cursor-pointer': clickableRows }"
					@click="onRowClick(tableItem)"
				>
					<div
						v-for="config in tableHeader"
						:key="config.propertyName"
						class="line-clamp-4 min-w-0 border-b border-slate-100 bg-white px-4 py-3 text-sm text-slate-700 transition-colors group-hover/row:bg-slate-50"
						:class="{
							'sticky right-0 z-0 shadow-rounded-left group-hover/row:bg-slate-50':
								config.propertyName === 'actions'
						}"
					>
						<div class="line-clamp-4 break-words">
							<slot
								v-if="config.propertyName === 'actions'"
								name="actions"
								:item="tableItem"
							/>
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
				</div>
			</div>
		</div>
		<div class="base-py base-px border-t border-slate-100 bg-white" v-if="pagination">
			<BasePagination
				:total="pagination.total"
				:limit="pagination.limit"
				:page="pagination.page"
				:last-page="pagination.lastPage"
				@update:page="(p) => updateFilters({ page: p })"
				@update:limit="(l) => updateFilters({ limit: l, page: 1 })"
			/>
		</div>
	</div>
</template>
