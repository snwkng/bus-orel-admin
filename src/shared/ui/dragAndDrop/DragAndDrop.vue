<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { CloseIcon } from '@/shared/ui/icons';

export interface Props {
	title?: string;
	accept?: string;
	name: string;
	multiple?: boolean;
	value?: File[];
}

const props = withDefaults(defineProps<Props>(), {
	title: '',
	accept: '',
	name: 'images',
	multiple: false,
	value: () => [] as File[]
});

const isDragging = ref(false);
const files = ref<File[]>([]);
const file = ref<any>(null);

const emit = defineEmits<(event: 'change', payload: File[]) => void>();

watch(() => props.value, () => {
	files.value = props.value;
})
const onChange = () => {
	const newFiles = Array.from(file.value.files).filter(
		(outerFile: unknown) =>
			!files.value.some(
				(innerFile: File) =>
					innerFile.name === (outerFile as File).name &&
					innerFile.size === (outerFile as File).size
			)
	);
	files.value.push(...(newFiles as File[]));
	emit('change', files.value);
};

const dragover = () => {
	isDragging.value = true;
};

const dragleave = () => {
	isDragging.value = false;
};

const drop = (event: DragEvent) => {
	const acceptFiles = new DataTransfer();
	if (props.accept.includes('image')) {
		Array.prototype.forEach.call(event.dataTransfer?.files, (file: File) => {
			if (props.accept.includes('image') && file.type.includes('image')) {
				acceptFiles.items.add(file);
			}
		});
	} else if (props.accept.includes('pdf') || props.accept.includes('openxmlformats')) {
		Array.prototype.forEach.call(event.dataTransfer?.files, (file: File) => {
			if (file.name.includes('.docx') || file.name.includes('.pdf')) {
				acceptFiles.items.add(file);
			}
		});
	}
	if (!acceptFiles.files.length) return;
	file.value.files = acceptFiles.files;
	onChange();
	isDragging.value = false;
};

const remove = (index: number) => {
	files.value.splice(index, 1);
};

const generatePreview = (file: File) => {
	let fileSrc = null;
	if (file.type.includes('openxmlformats')) {
		fileSrc = '/src/app/assets/icons/docxIcon.svg';
	} else if (file.type.includes('pdf')) {
		fileSrc = '/src/app/assets/icons/pdfIcon.svg';
	} else {
		fileSrc = URL.createObjectURL(file);
	}
	setTimeout(() => URL.revokeObjectURL(fileSrc), 1000 * 60);
	return fileSrc;
};

onMounted(() => {
	if (props.value.length && Object.keys(props.value[0]).length) {
		files.value = props.value;
	}
})
</script>
<template>
	<div class="flex flex-col">
		<h3 v-if="props.title" class="mb-1 text-slate-700">{{ props.title }}</h3>
		<div
			@dragover.prevent="dragover"
			@dragleave="dragleave"
			@drop.prevent="drop"
			class="flex min-h-[300px] grow flex-col items-center justify-center rounded-xl border border-gray-300 bg-white text-center shadow-sm"
			:style="isDragging && 'border: 1px solid #006DF0;'"
		>
			<input
				type="file"
				:multiple="typeof props.multiple === 'string' || props.multiple"
				:name="props.name"
				:id="props.name"
				class="absolute h-[1px] w-[1px] overflow-hidden opacity-0"
				@change="onChange"
				ref="file"
				:accept="props.accept"
			/>

			<label :for="props.name" class="block cursor-pointer text-xl">
				<div v-if="isDragging">Отпустите, чтобы переместить сюда файлы.</div>
				<div v-else>
					Перетащите сюда файлы или
					<span class="cursor-pointer font-bold text-deep-orange"
						>нажмите здесь</span
					>
					чтобы добавить файлы
				</div>
			</label>

			<div class="mt-8 flex flex-wrap p-4" v-if="files.length">
				<div
					v-for="file in files"
					:key="file.name"
					class="relative ml-1 mt-4 flex rounded-xl p-1"
				>
					<div class="flex w-[200px] flex-col overflow-hidden text-ellipsis">
						<img
							:src="generatePreview(file)"
							:alt="file.name"
							class="h-[200px] w-full rounded-xl object-fill"
						/>
						<span class="text-ellipsis text-nowrap text-sm text-slate-600">
							{{ file.name }}
						</span>
						<span class="text-ellipsis text-nowrap text-sm text-slate-600">{{
							Math.round(file.size / 1000) + 'kb'
						}}</span>
					</div>
					<div>
						<button
							class="absolute right-[-10px] top-[-10px] rounded-full bg-slate-100 p-2 shadow-md"
							type="button"
							@click="remove(files.indexOf(file))"
							title="Remove file"
						>
							<CloseIcon :width="16" :height="16" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
