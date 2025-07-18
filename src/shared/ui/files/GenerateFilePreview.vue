<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

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

const generatePreview = (): string => {
	let fileSrc = '';
	if (
		file.value?.type?.includes('openxmlformats') ||
		file.value?.name?.includes('.docx') ||
		file.value?.name?.includes('.doc')
	) {
		fileSrc = '/src/app/assets/icons/docxIcon.svg';
	} else if (
		file.value?.type?.includes('pdf') ||
		file.value?.name?.includes('.pdf')
	) {
		fileSrc = '/src/app/assets/icons/pdfIcon.svg';
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
			'flex items-center justify-center gap-x-1':
				file?.type?.includes('openxmlformats') || file?.type?.includes('pdf')
		}"
	>
		<img
			loading="lazy"
			:src="generatePreview()"
			:alt="file?.name"
			:class="[
				file?.type?.includes('openxmlformats') || file?.type?.includes('pdf')
					? 'h-7 w-7'
					: `${previewHeight} ${previewWidth} rounded-lg object-fill`
			]"
		/>
		<span
			v-if="
				file?.type?.includes('openxmlformats') || file?.type?.includes('pdf')
			"
		>
			{{ file?.name }}
		</span>
	</div>
</template>
