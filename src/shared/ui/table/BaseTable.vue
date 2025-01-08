<script setup lang="ts">
import dayjs from 'dayjs';

import { defineEmits, ref, watch } from 'vue';
import { TrashIcon, EditIcon } from '@/shared/ui/icons';

export interface Props {
	headers: { title: string; name: string; meta?: { classes?: string } }[];
	tableData?: any[];
	imagePath?: string;
	showActions?: boolean;
	emptyText?: string;
}

const baseURl =
	import.meta.env.MODE === 'development'
		? import.meta.env.VITE_DEV_BASE_URL
		: import.meta.env.VITE_BASE_URL;

const props = withDefaults(defineProps<Props>(), {
	headers: () => [],
	tableData: () => [],
	imagePath: '',
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
	<div class="mb-2 mt-6 overflow-hidden rounded-xl bg-white p-8 shadow lg:mt-0">
		<div class="relative grid max-w-full overflow-auto pb-5">
			<table class="w-full table-fixed">
				<thead class="w-fit select-none">
					<tr>
						<th
							class="relative bg-white text-left"
							:class="header.meta?.classes"
							v-for="header in props.headers"
							:key="header.name"
						>
							<div>{{ header.title }}</div>
						</th>
						<th class="bg-white text-center sticky right-0 w-24" v-if="showActions">
							<div>Действия</div>
						</th>
					</tr>
				</thead>
				<tbody class="overflow-auto">
					<tr
						class="flex h-52 w-full items-center justify-center"
						v-if="loading"
					>
						...loading
					</tr>
					<tr
						class="border-b border-neutral-300"
						v-for="row in props.tableData"
						:key="row"
						v-else-if="props.tableData?.length"
					>
						<td
							class="break-words align-top"
							v-for="key in headers"
							:key="key.name"
						>
							<slot :name="key.name" :row="row">
								<div
									class="flex flex-wrap gap-2"
									v-if="key.name.toLocaleLowerCase().includes('image')"
								>
									<img
										v-for="image in row[key.name]"
										:key="image._id"
										:src="`${baseURl}/public/images/${imagePath}/${image.name}`"
										alt=""
										width="80"
									/>
								</div>
								<div
									v-else-if="
										row[key.name] &&
										typeof row[key.name] === 'string' &&
										dayjs(row[key.name]).isValid()
									"
								>
									{{ dayjs(row[key.name]).format('DD.MM.YYYY') }}
								</div>
								<div
									class="line-clamp-4"
									v-else-if="row[key.name] instanceof Array"
								>
									<span
										v-for="(arrayData, index) in row[key.name]"
										:key="index"
									>
										{{ arrayData }}<br />
									</span>
								</div>
								<div
									class="line-clamp-4"
									v-else-if="
										typeof row[key.name] === 'string' &&
										row[key.name].length > 100
									"
								>
									{{ row[key.name] }}
								</div>
								<div v-else>
									{{ row[key.name]
									}}<span v-if="key.name.toLocaleLowerCase().includes('price')"
										>&#8381;</span
									>
								</div>
							</slot>
						</td>
						<td
							class="bg-white whitespace-pre-line break-words align-top text-center sticky right-0 w-24"
							v-if="showActions"
						>
							<div class="flex justify-center items-center gap-2">
								<button
									type="button"
									class="cursor-pointer"
									title="Редактировать"
									@click="editAction(row._id)"
								>
									<EditIcon fill="#009EFF" :width="30" :height="30" />
								</button>
								<button
									type="button"
									class="cursor-pointer"
									title="Удалить"
									@click="deleteAction(row._id)"
								>
									<TrashIcon fill="red" :width="30" :height="30" />
								</button>
							</div>
						</td>
					</tr>
					<tr class="flex h-52 w-full items-center justify-center" v-else>
						<span>{{ emptyText }}</span>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
