<script setup lang="ts">
export interface IProps {
  name: string;
	label?: string;
	column?: boolean;
}

defineProps<IProps>();
</script>
<template>
	<div :class="['flex gap-x-5 gap-y-2 w-full', { 'flex-col': column }]">
		<label class="the-label" :for="name">
			{{ label }}
		</label>
		<slot />
	</div>
</template>
