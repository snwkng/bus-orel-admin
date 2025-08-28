<script setup lang="ts">
import dayjs from 'dayjs';

import { defineEmits, ref, watch } from 'vue';
import { TrashIcon, EditIcon } from '@/shared/ui/icons';
import GenerateFilePreview from '@/shared/ui/files/GenerateFilePreview.vue';
import type { ITableDataConfig } from '@/shared/config/interfaces/table.interface';

export interface IProps {
	tableDataConfig: ITableDataConfig[];
	tableData?: any[];
	showActions?: boolean;
	emptyText?: string;
	getImage?: Function;
}

const props = withDefaults(defineProps<IProps>(), {
	tableDataConfig: () => [] as ITableDataConfig[],
	tableData: () => [],
	showActions: true,
	emptyText: 'Здесь пусто...'
});

const emit = defineEmits(['edit', 'delete']);

const loading = ref(true);

watch(
	() => props.tableData,
	() => {
		loading.value = false;
	}
);

const editAction = (id: string) => {
	emit('edit', id);
};

const deleteAction = (id: string) => {
	emit('delete', id);
};

const parsePropertyName = (propertyName: string, row: any) => {
	if (propertyName.includes('.')) {
		const properties = propertyName.split('.');
		const value = properties.reduce((obj, key) => obj && obj[key], row);
		return value;
	} else {
		return row[propertyName];
	}
};
</script>
<template>
	<div
		class="mb-2 mt-6 h-full overflow-hidden rounded-lg bg-white p-8 shadow lg:mt-0"
	>
		<div class="grid h-full max-w-full overflow-auto pb-5">
			<table class="w-full table-auto border-collapse">
				<colgroup>
					<col
						v-for="config in props.tableDataConfig"
						:key="config.propertyName"
						class="min-w-[150px]"
						:style="config?.cellWidth ? `min-width: ${config.cellWidth}` : ''"
					/>
				</colgroup>
				<thead
					class="sticky top-0 z-10 table-header-group w-fit select-none bg-white"
				>
					<tr>
						<th
							class="p-3 text-left align-middle"
							v-for="config in props.tableDataConfig"
							:key="config.propertyName"
						>
							{{ config.label }}
						</th>
						<th
							class="sticky right-0 w-24 bg-white p-3 text-center"
							v-if="showActions"
						>
							<div>Действия</div>
						</th>
					</tr>
				</thead>
				<tbody class="overflow-auto">
					<tr
						class="flex h-52 w-full items-center justify-center"
						v-if="loading"
					>
						<td :colspan="props.tableDataConfig.length" rowspan="5">
							loading...
						</td>
					</tr>
					<tr
						:class="{
							'border-b border-neutral-300':
								index !== props.tableData.length - 1
						}"
						v-for="(row, index) in props.tableData"
						:key="row"
						v-else-if="props.tableData?.length"
					>
						<td
							class="p-3 text-left align-top"
							v-for="config in tableDataConfig"
							:key="config.propertyName"
						>
							<slot :name="config.propertyName" :row="row">
								<div
									:class="{
										'line-clamp-4':
											typeof parsePropertyName(config.propertyName, row) ===
												'string' &&
											parsePropertyName(config.propertyName, row)?.length > 100
									}"
								>
									<template
										v-if="!config?.dataType || config?.dataType === 'text'"
									>
										{{ parsePropertyName(config.propertyName, row) }}
									</template>
									<template v-else-if="config?.dataType === 'money'">
										{{ parsePropertyName(config.propertyName, row) }}&#8381;
									</template>
									<template
										v-else-if="
											config?.dataType === 'date' &&
											dayjs(
												parsePropertyName(config.propertyName, row)
											).isValid()
										"
									>
										{{
											dayjs(parsePropertyName(config.propertyName, row)).format(
												'DD.MM.YYYY'
											)
										}}
									</template>
									<template v-if="config?.dataType === 'arrayString'">
										<div
											:class="{
												'line-clamp-4': parsePropertyName(
													config.propertyName,
													row
												).join('')?.length
											}"
										>
											{{
												parsePropertyName(config.propertyName, row).join(', ')
											}}
										</div>
									</template>
									<template v-if="config?.dataType === 'arrayDates'">
										<div>
											{{
												parsePropertyName(config.propertyName, row)
													?.map((x: Date) =>
														dayjs(x).format('DD.MM.YYYY')
													)
													?.join('\n')
											}}
										</div>
									</template>
									<template
										v-else-if="config?.dataType === 'image' && getImage"
									>
										<div class="flex flex-row flex-wrap gap-1">
											<div
												class="relative"
												v-for="imageName in parsePropertyName(
													config.propertyName,
													row
												)"
												:key="imageName"
											>
												<GenerateFilePreview
													:get-file="getImage(imageName)"
													preview-width="w-[80px]"
													preview-height="h-[70px]"
												/>
											</div>
										</div>
									</template>
								</div>
							</slot>
						</td>
						<td
							class="sticky right-0 w-24 whitespace-pre-line break-words bg-white text-center align-top"
							v-if="showActions"
						>
							<div class="flex items-center justify-center gap-2">
								<button
									type="button"
									class="cursor-pointer transition-transform hover:scale-150"
									title="Редактировать"
									@click="editAction(row._id)"
								>
									<EditIcon fill="#009EFF" :width="25" :height="25" />
								</button>
								<button
									type="button"
									class="cursor-pointer transition-transform hover:scale-150"
									title="Удалить"
									@click="deleteAction(row._id)"
								>
									<TrashIcon fill="red" :width="25" :height="25" />
								</button>
							</div>
						</td>
					</tr>
					<tr class="flex h-52 w-full items-center justify-center" v-else>
						{{
							emptyText
						}}
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
