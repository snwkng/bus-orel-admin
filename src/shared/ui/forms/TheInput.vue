<script setup lang="ts">
defineOptions({
	inheritAttrs: false // Отключаем автоматическую передачу атрибутов
});

export interface Props {
	placeholder?: string;
	type?: string;
	name?: string;
}

const props = withDefaults(defineProps<Props>(), {
	type: 'text'
});

defineEmits(['update:model', 'keydown']);

const model = defineModel();
</script>
<template>
	<input
		v-if="props.type === 'text'"
		:id="props.name"
		:name="props.name"
		:type="props.type"
		:placeholder="props.placeholder"
		class="the-input"
		v-model.trim="model"
		@keydown="$emit('keydown', $event)"
	/>
	<input
		v-if="props.type === 'number'"
		:id="props.name"
		:name="props.name"
		:type="props.type"
		:placeholder="props.placeholder"
		class="the-input"
		v-model.trim.number="model"
		@keydown="$emit('keydown', $event)"
	/>
</template>
