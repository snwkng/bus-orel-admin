<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../model';
import { ApiError } from '@/shared/api/types';

const { loginAction } = useAuthStore();

const router = useRouter();

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const loginHandler = async () => {
  if (isLoading.value) return;
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await loginAction(username.value, password.value);
    router.replace('/');
  } catch (err) {
    errorMessage.value =
      err instanceof ApiError && err.status === 401
        ? 'Неверный логин или пароль'
        : 'Не удалось войти. Попробуйте позже';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
	<form class="w-90 rounded-2xl bg-white p-8 shadow-card">
		<h1 class="mb-1 text-2xl font-bold text-slate-900">Вход в панель управления</h1>
		<p class="mb-6 text-sm text-slate-500">Галатур — автобусные туры и экскурсии</p>
		<div class="mb-5">
			<label
				for="username"
				class="mb-2 block text-sm font-medium text-slate-700"
				>Логин</label
			>
			<input
				type="text"
				id="username"
				class="the-input"
				placeholder="login"
				required
        v-model="username"
				@keydown.enter="loginHandler"
			/>
		</div>
		<div class="mb-6">
			<label
				for="password"
				class="mb-2 block text-sm font-medium text-slate-700"
			>
				Пароль
			</label>
			<input
				type="password"
				id="password"
				autocomplete="current-password webauthn"
				class="the-input"
				required
        v-model="password"
				@keydown.enter="loginHandler"
			/>
		</div>
		<button
			type="button"
			class="base-btn w-full"
			:disabled="isLoading"
      @click="loginHandler"
		>
			{{ isLoading ? 'Вход…' : 'Войти' }}
		</button>
		<p v-if="errorMessage" class="mt-4 text-sm text-red-600">
			{{ errorMessage }}
		</p>
	</form>
</template>
