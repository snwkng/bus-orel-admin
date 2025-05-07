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
	<div class="mb-2 mt-6 h-full rounded-xl bg-white p-8 shadow lg:mt-0 overflow-hidden">
		<div class="relative grid max-w-full overflow-auto pb-5 h-full">
			<table class="w-full table-fixed">
				<thead class="w-fit select-none sticky top-0 z-10">
					<tr>
						<th
							class="relative bg-white text-left"
							:class="header.meta?.classes"
							v-for="header in props.headers"
							:key="header.name"
						>
							<div>{{ header.title }}</div>
						</th>
						<th
							class="sticky right-0 w-24 bg-white text-center"
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
										<span v-if="arrayData instanceof Object">
											{{ arrayData?.name }} <br />
										</span>
										<span v-else>{{ arrayData }}<br /></span>
									</span>
								</div>
								<div
									class="line-clamp-4"
									v-else-if="row[key.name] instanceof Object"
								>
									<span v-if="row[key.name] instanceof Object">
										{{ row[key.name]?.name }} <br />
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
							class="sticky right-0 w-24 whitespace-pre-line break-words bg-white text-center align-top"
							v-if="showActions"
						>
							<div class="flex items-center justify-center gap-2">
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
						{{ emptyText }}
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
