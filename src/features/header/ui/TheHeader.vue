<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { PanelRightOpenIcon } from '@lucide/vue';
import { useExpanded } from '@/shared/lib/useExpanded';

const route = useRoute();

const { isExpanded, changeExpanded } = useExpanded()

const title = computed(() => route.meta?.title ?? '');
</script>
<template>
	<header
		class="header-height base-px flex shrink-0 items-center border-b border-slate-200 bg-white"
	>
		<div class="flex items-center gap-4">
			<div
				class="cursor-pointer rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
				@click="changeExpanded(!isExpanded)"
				:title="isExpanded ? 'Свернуть' : 'Развернуть'"
			>
				<PanelRightOpenIcon
					:size="20"
					:class="['duration-300', { 'rotate-180': !isExpanded }]"
				/>
			</div>
			<h1 class="w-fit text-lg font-bold text-slate-900">{{ title }}</h1>
		</div>
	</header>
</template>
