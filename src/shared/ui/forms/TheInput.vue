<script setup lang="ts">
defineOptions({
  inheritAttrs: false // Отключаем автоматическую передачу атрибутов
});

const model = defineModel();

export interface Props {
	placeholder?: string;
	type?: string;
	name?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'text'
});
</script>
<template>
	<input
		v-if="type === 'text'"
		:id="name"
		:name="name"
		:type="props.type"
		:placeholder="props.placeholder"
		class="the-input"
		v-model.trim="model"
	/>
	<input
		v-if="type === 'number'"
		:id="name"
		:name="name"
		:type="props.type"
		:placeholder="props.placeholder"
		class="the-input"
		v-model.trim.number="model"
	/>
</template>
