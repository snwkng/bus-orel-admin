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
	<header class="header-height flex items-center bg-white">
		<div class="flex items-center gap-5">
			<div
				class="cursor-pointer rounded-xl p-2 transition-all hover:bg-slate-100 hover:shadow-2xl"
				@click="changeExpanded(!isExpanded)"
				:title="isExpanded ? 'Свернуть' : 'Развернуть'"
			>
				<PanelRightOpenIcon
					:size="24"
					color="#291715"
					:class="['duration-300', { 'rotate-180': !isExpanded }]"
				/>
			</div>
			<h1 class="w-fit text-xl font-bold">{{ title }}</h1>
		</div>
	</header>
</template>
