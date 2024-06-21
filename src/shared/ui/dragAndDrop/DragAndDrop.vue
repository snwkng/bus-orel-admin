<script setup lang="ts">
import { ref } from 'vue';

const isDragging = ref(false);
const files = ref<File[]>([]);
const file = ref<any>(null);

const onChange = () => {
	const newFiles = Array.from(file.value.files).filter(
		(outerFile: unknown) =>
			!files.value.some(
				(innerFile: File) =>
					innerFile.name === (outerFile as File).name &&
					innerFile.size === (outerFile as File).size
			)
	);
  files.value.push(...newFiles as File[]);
};

const dragover = () => {
	isDragging.value = true;
};

const dragleave = () => {
	isDragging.value = false;
};

const drop = (event: DragEvent) => {
	file.value.files = event.dataTransfer?.files;
	onChange();
	isDragging.value = false;
};

const remove = (index: number) => {
	files.value.splice(index, 1);
};

const generatePreview = (file: File) => {
	const fileSrc = URL.createObjectURL(file);
	setTimeout(() => URL.revokeObjectURL(fileSrc), 1000 * 60);
	return fileSrc;
};
</script>
<template>
	<div
		@dragover.prevent="dragover"
		@dragleave="dragleave"
		@drop.prevent="drop"
		class="flex min-h-[300px] grow items-center justify-center rounded-xl border border-gray-300 bg-white text-center shadow-sm"
		:style="isDragging && 'border: 1px solid #006DF0;'"
	>
		<input
			type="file"
			multiple
			name="file"
			id="fileInput"
			class="absolute h-[1px] w-[1px] overflow-hidden opacity-0"
			@change="onChange"
			ref="file"
			accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.svg,.webp"
		/>

		<label for="fileInput" class="block cursor-pointer text-xl">
			<div v-if="isDragging">Отпустите, чтобы переместить сюда файлы.</div>
			<div v-else>
				Перетащите сюда файлы или
				<span class="cursor-pointer font-bold text-deep-orange"
					>нажмите здесь</span
				>
				чтобы добавить файлы
			</div>
		</label>

		<div class="mt-8 flex" v-if="files.length">
			<div
				v-for="file in files"
				:key="file.name"
				class="ml-1 mt-4 flex border border-gray-500 p-1"
			>
				<div>
					<img
						:src="generatePreview(file)"
						:alt="file.name"
						class="h-10 w-10"
					/>
					<p>
						{{ file.name }}
						{{ Math.round(file.size / 1000) + 'kb' }}
					</p>
				</div>
				<div>
					<button
						class="ml-2"
						type="button"
						@click="remove(files.indexOf(file))"
						title="Remove file"
					>
						<b>×</b>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
