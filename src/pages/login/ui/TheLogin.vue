<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');

const login = async () => {
  // TODO
}
</script>

<template>
	<form class="mx-auto w-72">
		<div class="mb-5">
			<label
				for="email"
				class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
				>Логин</label
			>
			<input
				type="email"
				id="email"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				placeholder="login"
				required
        v-model="username"
			/>
		</div>
		<div class="mb-5">
			<label
				for="password"
				class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
			>
				Пароль
			</label>
			<input
				type="password"
				id="password"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				required
        v-model="password"
			/>
		</div>
		<button
			type="submit"
			class="w-32 base-btn"
		>
			Войти
		</button>
	</form>
</template>
