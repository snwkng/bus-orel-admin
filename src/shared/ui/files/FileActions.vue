<script setup lang="ts">
import { computed } from 'vue';
import { Eye, Download } from '@lucide/vue';
import { useFileActions } from '@/shared/lib/useFileActions';

const props = defineProps<{
	files?: string[];
}>();

const fileName = computed(() => props.files?.[0]);
const isPdf = computed(() => fileName.value?.toLowerCase().endsWith('.pdf'));

const { openFileInNewTab, downloadFile } = useFileActions();
</script>
<template>
	<div v-if="fileName" class="flex items-center gap-1">
		<button
			v-if="isPdf"
			type="button"
			class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-deep-teal"
			title="Открыть в новой вкладке"
			@click.stop="openFileInNewTab(fileName)"
		>
			<Eye :size="18" />
		</button>
		<button
			type="button"
			class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-deep-teal"
			title="Скачать"
			@click.stop="downloadFile(fileName)"
		>
			<Download :size="18" />
		</button>
	</div>
	<span v-else class="text-slate-400">—</span>
</template>
