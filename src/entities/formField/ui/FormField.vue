<script setup lang="ts">
export interface IProps {
  name: string;
	label?: string;
	column?: boolean;
}

defineProps<IProps>();
</script>
<template>
	<div :class="['flex gap-x-5 gap-y-2', { 'flex-col': column }]">
		<label class="block text-nowrap font-semibold" :for="name">
			{{ label }}
		</label>
		<slot />
	</div>
</template>
