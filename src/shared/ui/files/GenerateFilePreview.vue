<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { ImageOff } from '@lucide/vue';
import docxIcon from '@/app/assets/icons/docxIcon.svg';
import pdfIcon from '@/app/assets/icons/pdfIcon.svg';

export interface Props {
	getFile: Promise<File | void> | File;
	previewWidth?: string;
	previewHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
	getFile: async () => {},
	previewWidth: 'w-[220px]',
	previewHeight: 'h-[200px]'
});

const file: Ref<File | null> = ref(null);
const loadFailed = ref(false);

const isDocument = computed(
	() =>
		file.value?.type?.includes('openxmlformats') ||
		file.value?.type?.includes('pdf')
);

const generatePreview = (): string => {
	let fileSrc = '';
	if (
		file.value?.type?.includes('openxmlformats') ||
		file.value?.name?.includes('.docx') ||
		file.value?.name?.includes('.doc')
	) {
		fileSrc = docxIcon;
	} else if (
		file.value?.type?.includes('pdf') ||
		file.value?.name?.includes('.pdf')
	) {
		fileSrc = pdfIcon;
	} else if (file.value?.name) {
		fileSrc = URL.createObjectURL(file.value);
	}
	setTimeout(() => URL.revokeObjectURL(fileSrc), 1000 * 60);
	return fileSrc;
};

onMounted(async () => {
	file.value = (await props.getFile) || null;
});
</script>
<template>
	<div
		:class="{
			'flex items-center justify-center gap-x-1': isDocument
		}"
	>
		<div
			v-if="loadFailed && !isDocument"
			class="flex items-center justify-center rounded-lg bg-slate-100 text-slate-400"
			:class="`${previewHeight} ${previewWidth}`"
			:title="`Не удалось загрузить ${file?.name ?? 'изображение'}`"
		>
			<ImageOff :width="32" :height="32" />
		</div>
		<template v-else>
			<img
				loading="lazy"
				:src="generatePreview()"
				:alt="file?.name"
				:class="[
					isDocument
						? 'h-7 w-7'
						: `${previewHeight} ${previewWidth} rounded-lg object-fill`
				]"
				@error="loadFailed = true"
			/>
			<span v-if="isDocument">
				{{ file?.name }}
			</span>
		</template>
	</div>
</template>
