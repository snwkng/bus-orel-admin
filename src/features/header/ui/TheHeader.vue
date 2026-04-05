<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const title = computed(() => route.meta?.title ?? '')
</script>
<template>
	<header
		class="flex header-height items-center bg-white base-px"
	>
		<h1 class="font-bold uppercase text-xl w-fit">{{ title }}</h1>
	</header>
</template>
