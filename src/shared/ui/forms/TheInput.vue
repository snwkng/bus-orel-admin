<script setup lang="ts">

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

const emit = defineEmits<(event: 'update:modelValue', payload: string) => void>();

</script>
<template>
	<label class="block">
		<span class="text-gray-700">{{ label }}</span>
		<input
			:type="type"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			:placeholder="placeholder || label"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
		/>
	</label>
</template>
