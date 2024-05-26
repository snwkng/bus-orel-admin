<script setup lang="ts">
import { useRoute, RouterView } from 'vue-router';
import { DefaultLayout } from '@/shared/ui/layouts';
import { computed } from 'vue';

const route = useRoute();
const layout = computed(() => route.meta.layout || DefaultLayout);
</script>

<template>
	<component :is="layout">
		<template #default>
			<router-view />
		</template>
	</component>
</template>
