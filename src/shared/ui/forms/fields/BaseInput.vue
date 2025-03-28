<script setup lang="ts">
import { computed } from 'vue';


export interface Props {
	label?: string;
	placeholder?: string;
  modelValue: string;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
	label: '',
	placeholder: '',
	modelValue: '',
  type: 'text'
});
</script>

<template>
  <div>

  </div>
</template>