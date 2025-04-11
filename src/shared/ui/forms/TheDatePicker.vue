<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ru } from 'date-fns/locale';

const model = defineModel<Date | string>();
</script>

<template>
   <VueDatePicker v-model="model" :format-locale="ru" :enable-time-picker="false" format="dd MMMM yyyy">
    <template #action-row="{ selectDate }">
      <button class="w-full secondary-btn" @click="selectDate">Выбрать дату</button>
    </template>
   </VueDatePicker>
</template>