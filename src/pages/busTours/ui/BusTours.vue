<script setup lang="ts">
import BusToursTable from '@/entities/busTours';
</script>
<template>
	<div class="px-6 py-6 md:px-12 md:py-12 h-full flex flex-col">
		<div class="mb-4 flex flex-col gap-y-1">
			<h1 class="text-3xl font-bold">Автобусыне туры к морю</h1>
			<h4 class="text-xm font-medium text-slate-400">
				Добавляйте, редатируйте и удаляйте туры
			</h4>
			<div class="flex items-center pt-3" title="Добавить тур">
				<router-link class="base-btn" to="/bus-tours/create">Добавить тур</router-link>
			</div>
		</div>
		<BusToursTable />
	</div>
</template>
