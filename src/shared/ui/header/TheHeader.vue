<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const searchText = ref('');

watch(searchText, (val) => {
	if (val === '') {
		router.push({})
	} else {
		debounce(() => router.push({ query: { search: searchText.value } }));
	}
});

const debounce = (func: Function, delayMs: number = 1000) => {
	const timeout = setTimeout(() => {
		func();
		clearTimeout(timeout);
	}, delayMs);
};
</script>
<template>
	<header
		class="flex h-20 w-full items-center bg-white px-6 py-6 md:px-12 md:py-12"
	>
		<input
			v-if="route.name === 'excursions' || route.name === 'bus-tours'"
			class="rounded-xl min-w-80"
			type="search"
			name="search-input"
			placeholder="Поиск по названию"
			v-model.trim="searchText"
		/>
	</header>
</template>
