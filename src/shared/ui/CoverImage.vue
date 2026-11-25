<script setup lang="ts">
import { computed, ref } from 'vue';
import { ImageOff } from '@lucide/vue';

const props = defineProps<{
	images?: string[];
}>();

const failed = ref(false);

const list = computed(() => props.images ?? []);
const src = computed(() => (list.value.length ? `/api/s3/download/${list.value[0]}` : ''));
</script>
<template>
	<div class="relative h-[70px] w-[70px] shrink-0">
		<div
			v-if="!src || failed"
			class="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400"
			title="Фото отсутствует"
		>
			<ImageOff :width="24" :height="24" />
		</div>
		<template v-else>
			<img
				:src="src"
				:alt="list[0]"
				loading="lazy"
				class="h-[70px] w-[70px] rounded-xl bg-slate-100 object-cover"
				@error="failed = true"
			/>
			<span
				v-if="list.length > 1"
				class="absolute right-1 bottom-1 rounded-md bg-slate-900/70 px-1.5 py-0.5 text-xs font-medium text-white"
			>
				+{{ list.length - 1 }}
			</span>
		</template>
	</div>
</template>
