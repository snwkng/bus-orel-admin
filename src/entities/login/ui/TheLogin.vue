<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '../model';

const { login } = useLoginStore();

const router = useRouter();

const username = ref('');
const password = ref('');

const loginHandler = async () => {
  await login(username.value, password.value).then(() => {
    router.replace('/');
  })
}
</script>

<template>
	<form class="mx-auto w-72">
		<div class="mb-5">
			<label
				for="username"
				class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
				>Логин</label
			>
			<input
				type="username"
				id="username"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				placeholder="login"
				required
        v-model="username"
				@keydown.enter="loginHandler"
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
				@keydown.enter="loginHandler"
			/>
		</div>
		<button
			type="button"
			class="w-32 base-btn"
      @click="loginHandler"
		>
			Войти
		</button>
	</form>
</template>
