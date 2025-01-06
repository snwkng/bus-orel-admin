<script setup lang="ts">
export interface Props {
	file: File | null;
}

const props = withDefaults(defineProps<Props>(), {
	file: null
});

const generatePreview = (): string => {
	console.log(props.file);
	let fileSrc = '';
	if (
		props.file?.type?.includes('openxmlformats') ||
		props.file?.name?.includes('.docx') ||
		props.file?.name?.includes('.doc')
	) {
		fileSrc = '/src/app/assets/icons/docxIcon.svg';
	} else if (
		props.file?.type?.includes('pdf') ||
		props.file?.name?.includes('.pdf')
	) {
		fileSrc = '/src/app/assets/icons/pdfIcon.svg';
	} else if (props.file?.name) {
		fileSrc = URL.createObjectURL(props.file);
	}
	setTimeout(() => URL.revokeObjectURL(fileSrc), 1000 * 60);
	return fileSrc;
};
</script>
<template>
	<div
		:class="{
			'flex items-center justify-center gap-x-1':
				file?.type?.includes('openxmlformats') || file?.type?.includes('pdf')
		}"
	>
		<img
			:src="generatePreview()"
			:alt="props.file?.name"
			:class="[
				props.file?.type?.includes('openxmlformats') ||
				props.file?.type?.includes('pdf')
					? 'h-7 w-7'
					: 'h-[200px] w-[220px] rounded-xl object-fill'
			]"
		/>
		<span
			v-if="
				props.file?.type?.includes('openxmlformats') ||
				props.file?.type?.includes('pdf')
			"
		>
			{{ props.file?.name }}
		</span>
	</div>
</template>
