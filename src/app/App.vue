<script setup lang="ts">
  import { useRoute } from "vue-router";
	import BaseToast from '@/shared/ui/toasts/BaseToast.vue';
  const route = useRoute();
</script>

<template>
	<component :is="route.meta.layoutComponent">
		<template #default>
			<router-view />
		</template>
	</component>
	<BaseToast />
</template>
