<script setup lang="ts">
import { RouteNames } from '@/app/router/RouteNames.enum';
import ExcursionsTable from '@/entities/excursions';
</script>
<template>
	<div class="h-full flex flex-col">
		<div class="mb-4 flex flex-col gap-y-1">
			<div class="flex items-center" title="Добавить экскурсию">
				<router-link class="base-btn" :to="{name: RouteNames.CreateExcursion}">Добавить экскурсию</router-link>
			</div>
		</div>

		<ExcursionsTable />
	</div>
</template>
