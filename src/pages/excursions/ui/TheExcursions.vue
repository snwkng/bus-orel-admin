<script setup lang="ts">
import ExcursionsTable from '@/entities/excursions';
</script>
<template>
	<div>
		<div class="mb-4 flex flex-col gap-y-1">
			<h1 class="text-3xl font-bold">Экскурсии</h1>
			<h4 class="text-xm font-medium text-slate-400">
				Добавляйте, редатируйте и удаляйте экскурсии
			</h4>
			<div class="flex items-center pt-3" title="Добавить экскурсию">
				<router-link class="base-btn" to="/excursions/create">Добавить экскурсию</router-link>
			</div>
		</div>

		<ExcursionsTable />
	</div>
</template>
