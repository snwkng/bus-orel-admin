<script setup lang="ts">
import { ref, watch } from 'vue';
import { CloseIcon } from '@/shared/ui/icons';
import { useExcursionStore } from '@/entities/excursions/model';
import { useBusTourStore } from '@/entities/busTours/model';

import GenerateFilePreview from '@/shared/ui/files/GenerateFilePreview.vue';

export interface Props {
	accept?: string;
	name: string;
	multiple?: boolean;
	value?: string[];
	place: string;
}

const props = withDefaults(defineProps<Props>(), {
	accept: '',
	name: 'images',
	multiple: false,
	value: () => [] as string[]
});

const emit = defineEmits<(event: 'change', payload: string[]) => void>();

const store =
	props.place === 'excursion' ? useExcursionStore() : useBusTourStore();
const { getFile, uploadFile, deleteFile } = store;
const files = ref<File[]>([]);
const file = ref<any>(null);

watch(
	() => props.value,
	() => {
		if (props.value.length !== files.value.length) {
			props.value.forEach(async (x: string) => {
				if (files.value.findIndex((y: File) => y?.name === x) === -1) {
					const res = await getFile(x);
					if (res) {
						files.value.push(res);
					}
				}
			});
		}
	}
);

const remove = async (index: number, fileName: string) => {
	try {
		await deleteFile(fileName);
		files.value.splice(index, 1);
		emit(
			'change',
			files.value.map((x: File) => x.name)
		);
	} catch (error) {
		console.error('err');
	}
};

const onChange = () => {
	const newFiles = Array.from(file.value.files) as File[];
	const arrayFunctions = newFiles.map((x: File) => {
		const formData = new FormData();
		formData.append('file', x);
		return uploadFile(formData);
	});
	Promise.all(arrayFunctions).then((res: string[]) => {
		files.value = [
			...files.value,
			...newFiles.map((x, index) => {
				const file: File = new File([x], res[index], {
					type: x.type
				});
				return file;
			})
		];
		emit(
			'change',
			files.value.map((x: File) => x.name)
		);
	});
};
</script>
<template>
	<div
		class="flex w-full flex-wrap gap-5 rounded-lg bg-white p-5"
		v-if="props.value.length"
	>
		<div class="relative" v-for="file in files" :key="file.name">
			<GenerateFilePreview :get-file="file" />
			<button
				:class="[
					file?.type?.includes('openxmlformats') || file?.type?.includes('pdf')
						? 'right-[-25px] top-[-10px]'
						: 'right-[-10px] top-[-10px]',
					'absolute rounded-full bg-slate-100 p-2 shadow-md'
				]"
				type="button"
				@click="remove(files.indexOf(file), file.name)"
				title="Удалить файл"
			>
				<CloseIcon :width="12" :height="12" />
			</button>
		</div>
	</div>
	<div class="mt-2">
		<label :for="props.name" class="block">
			<span class="secondary-btn cursor-pointer">{{
				props.multiple ? 'Добавить файлы' : 'Добавить файл'
			}}</span>
			<input
				type="file"
				:multiple="props.multiple"
				:name="props.name"
				:id="props.name"
				class="hidden"
				@change="onChange"
				ref="file"
				:accept="props.accept"
			/>
		</label>
	</div>
</template>
