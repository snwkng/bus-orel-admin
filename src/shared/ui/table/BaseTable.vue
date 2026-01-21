<script setup lang="ts">
import dayjs from 'dayjs';

import { ref, watch } from 'vue';
import { TrashIcon, EditIcon } from '@/shared/ui/icons';
import type { ITableDataConfig } from '@/shared/config/interfaces/table.interface';

export interface IProps {
	tableDataConfig: ITableDataConfig[];
	tableData?: any[];
	showActions?: boolean;
	emptyText?: string;
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
								<template v-if="config?.dataType === 'money'">
									{{ row[config.propertyName] }}&#8381;
								</template>
								<template
									v-else-if="
										config?.dataType === 'date' &&
										dayjs(row[config.propertyName]).isValid()
									"
								>
									{{ dayjs(row[config.propertyName]).format('DD.MM.YYYY') }}
								</template>
								<!-- TODO: продумать логику работы с массивами и вложенными объектами -->
								<template
									v-else-if="
										config?.dataType === 'arrayString' &&
										row[config.propertyName]?.length &&
										typeof row[config.propertyName] === 'object'
									"
								>
									<div
										:class="{
											'line-clamp-4':
												row[config.propertyName].join('').length > 300
										}"
									>
										<p
											v-for="(value, index) in row[config.propertyName]"
											:key="index"
										>
											{{ value }}
										</p>
									</div>
								</template>
								<template v-else-if="config?.dataType === 'arrayDates'">
									<div>
										{{
											row[config.propertyName]
												?.map((x: Date) => dayjs(x).format('DD.MM.YYYY'))
												?.join('\n')
										}}
									</div>
								</template>
								<template v-else-if="config?.dataType === 'images'">
									<div class="flex flex-row flex-wrap gap-1">
										<div
											class="relative"
											v-for="(imageName, index) in row[config.propertyName]"
											:key="imageName"
										>
											<img
												loading="lazy"
												:src="`/api/s3/download/${imageName}`"
												:alt="`preview-${index}`"
												class="h-[70px] w-[80px] rounded-lg object-fill"
											/>
										</div>
									</div>
								</template>
								<template v-else>
									<span
										:class="{
											'line-clamp-4': row[config.propertyName]?.length > 100
										}"
									>
										{{ config.propertyName.split('.').reduce((acc, key) => acc && acc[key], row) }}
									</span>
								</template>
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
									<EditIcon fill="#006DF0" :width="25" :height="25" />
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
						{{ emptyText }}
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
