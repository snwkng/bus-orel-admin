<script lang="ts">
import type { RouteLocationRaw } from 'vue-router';

export interface RecentItem {
	id: string;
	title: string;
	subtitle?: string;
	value: string;
	to: RouteLocationRaw;
}
</script>
<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps<{
	title: string;
	linkTo: RouteLocationRaw;
	linkLabel: string;
	items: RecentItem[];
	emptyText: string;
	loading?: boolean;
}>();
</script>
<template>
	<section class="rounded-2xl bg-white p-6 shadow-card">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-slate-800">{{ title }}</h2>
			<RouterLink class="link text-sm" :to="linkTo">{{ linkLabel }}</RouterLink>
		</div>
		<div
			v-if="!loading && !items.length"
			class="py-8 text-center text-sm text-slate-400"
		>
			{{ emptyText }}
		</div>
		<ul v-else class="divide-y divide-slate-100">
			<li v-for="item in items" :key="item.id">
				<RouterLink
					class="flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50"
					:to="item.to"
				>
					<div class="min-w-0">
						<div class="truncate font-medium text-slate-900">
							{{ item.title }}
						</div>
						<div v-if="item.subtitle" class="truncate text-sm text-slate-500">
							{{ item.subtitle }}
						</div>
					</div>
					<div class="shrink-0 text-sm text-slate-600">{{ item.value }}</div>
				</RouterLink>
			</li>
		</ul>
	</section>
</template>
