<script setup lang="ts">
export interface Props {
	fill?: string;
	width?: number;
	height?: number;
}

const props = withDefaults(defineProps<Props>(), {
	fill: '#020202',
	width: 32,
	height: 32
});
</script>
<template>
	<svg
		:width="props.width"
		:height="props.height"
		viewBox="-0.5 0 25 25"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M3 21.32L21 3.32001"
			:stroke="props.fill"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M3 3.32001L21 21.32"
			:stroke="props.fill"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</template>
