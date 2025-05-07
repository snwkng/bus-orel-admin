<script setup lang="ts">
export interface Props {
	placeholder?: string;
	name?: string;
}

const props = withDefaults(defineProps<Props>(), {
	placeholder: '',
});

const model = defineModel<string>();
</script>
<template>
	<textarea
		class="the-input whitespace-pre-line"
		rows="4"
		:name="name"
		:placeholder="props.placeholder"
		v-model.trim="model"
	/>
</template>
