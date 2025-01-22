<script setup lang="ts">
export interface IProps {
  fill?: string
  width?: number,
  height?: number
}

withDefaults(defineProps<IProps>(), {
  fill: '#020202',
  width: 32,
  height: 32
})
</script>
<template>
	<svg
		:stroke="fill"
		:width="width"
		:height="height"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M17 9.5L12 14.5L7 9.5"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</template>