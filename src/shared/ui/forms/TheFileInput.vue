<script setup lang="ts">
import { ref, watch, toRef } from 'vue';
import { CloseIcon } from '@/shared/ui/icons';
import { useExcursionStore } from '@/entities/excursions/model';
import { useBusTourStore } from '@/entities/busTours/model';
import { useFieldArray, type FieldEntry } from 'vee-validate';

import GenerateFilePreview from '@/shared/ui/files/GenerateFilePreview.vue';

export interface Props {
	accept?: string;
	name: string;
	label?: string;
	column?: boolean;
	multiple?: boolean;
	place: string;
	required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	accept: '',
	multiple: false
});

const name = toRef(props, 'name');

const { remove, push, replace, fields } = useFieldArray(name);

const store =
	props.place === 'excursion' ? useExcursionStore() : useBusTourStore();
const { getFile, uploadFile, deleteFile } = store;
const files = ref<File[]>([]);
const file = ref<any>(null);

watch(
	() => fields.value,
	async () => {
		if (fields.value.length !== files.value.length) {
			fields.value?.forEach(
				async (x: FieldEntry<unknown> | FieldEntry<string>) => {
					if (
						x.value &&
						files.value.findIndex((y: File) => y?.name === x.value) === -1
					) {
						const res = await getFile(x.value as string);
						if (res) {
							files.value.push(res);
						}
					}
				}
			);
		}
	}
);

const removeFile = async (index: number, fileName: string) => {
	try {
		await deleteFile(fileName);
		files.value.splice(index, 1);
		remove(index);
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
		const updatedFiles = [
			...newFiles.map((x, index) => {
				const file: File = new File([x], res[index], {
					type: x.type
				});
				return file;
			})
		];
		files.value = props.multiple ? [...files.value, ...updatedFiles] : [...updatedFiles];
		replace(files.value?.map((x: File) => x.name));
	});
};
</script>
<template>
	<div :class="['flex w-full gap-x-5 gap-y-2', { 'flex-col': column }]">
		<label class="the-label" v-if="label" :for="name">
			{{ label }}
			<span class="text-red-600" v-if="required">*</span>
		</label>
		<div
			class="flex w-full flex-wrap gap-5 rounded-lg bg-white p-5"
			v-if="fields?.length"
		>
			<div class="relative" v-for="file in files" :key="file.name">
				<GenerateFilePreview :get-file="file" />
				<button
					:class="[
						file?.type?.includes('openxmlformats') ||
						file?.type?.includes('pdf')
							? 'right-[-25px] top-[-10px]'
							: 'right-[-10px] top-[-10px]',
						'absolute rounded-full bg-slate-100 p-2 shadow-md'
					]"
					type="button"
					@click="removeFile(files.indexOf(file), file.name)"
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
	</div>
</template>
