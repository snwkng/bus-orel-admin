<script setup lang="ts">
import { RouteNames } from '@/app/router/RouteNames.enum';
import HotelsTable from '@/entities/hotels';
</script>
<template>
	<div class="flex h-full flex-col">
		<div class="mb-4 flex flex-col gap-y-1">
			<div class="flex items-center" title="Добавить тур">
				<router-link class="base-btn" :to="{ name: RouteNames.CreateHotel }">
					Добавить тур
				</router-link>
			</div>
		</div>
		<HotelsTable />
	</div>
</template>
