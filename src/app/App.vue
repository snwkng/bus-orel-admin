<script setup lang="ts">
  import { useRoute } from "vue-router";
	import BaseToast from '@/shared/ui/toasts/BaseToast.vue';
  const route = useRoute();

// const route = useRoute();
// const layout = computed(() => route.meta.layout || DefaultLayout);
</script>

<template>
	<component :is="route.meta.layoutComponent">
		<template #default>
			<router-view />
		</template>
	</component>
	<BaseToast />
</template>
