<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ArrowLeft, PanelRightOpenIcon, Sun, Moon, LogOut, User } from '@lucide/vue';
import { useExpanded } from '@/shared/lib/useExpanded';
import { useTheme } from '@/shared/lib/useTheme';
import { useUnsavedChangesStore } from '@/shared/lib/useUnsavedChanges';
import { useAuthStore } from '@/features/auth/model';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const { isExpanded, changeExpanded } = useExpanded()
const { isDark, toggleTheme } = useTheme()

const title = computed(() => route.meta?.title ?? '');
const backTo = computed(() => route.meta?.backTo as string | undefined);

const unsavedChanges = useUnsavedChangesStore();

const goBack = () => {
	if (
		unsavedChanges.dirty &&
		!window.confirm('Есть несохранённые изменения. Уйти без сохранения?')
	) {
		return;
	}
	unsavedChanges.setDirty(false);
	router.push({ name: backTo.value });
};
</script>
<template>
	<header
		class="header-height base-px flex shrink-0 items-center border-b border-slate-200 bg-white"
	>
		<div class="flex items-center gap-4">
			<div
				class="cursor-pointer rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
				@click="changeExpanded(!isExpanded)"
				:title="isExpanded ? 'Свернуть' : 'Развернуть'"
			>
				<PanelRightOpenIcon
					:size="20"
					:class="['duration-300', { 'rotate-180': !isExpanded }]"
				/>
			</div>
			<button
				v-if="backTo"
				type="button"
				class="cursor-pointer rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
				title="Назад к списку"
				@click="goBack"
			>
				<ArrowLeft :size="20" />
			</button>
			<h1 class="w-fit text-lg font-bold text-slate-900">{{ title }}</h1>
		</div>
		<div class="ml-auto flex items-center gap-1">
			<span
				v-if="user"
				class="mr-2 flex items-center gap-2 text-sm font-medium text-slate-600"
				:title="`Вы вошли как ${user.username}`"
			>
				<User :size="16" />
				{{ user.username }}
			</span>
			<button
				type="button"
				class="cursor-pointer rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
				:title="isDark ? 'Светлая тема' : 'Тёмная тема'"
				@click="toggleTheme"
			>
				<Sun v-if="isDark" :size="20" />
				<Moon v-else :size="20" />
			</button>
			<button
				type="button"
				class="cursor-pointer rounded-lg p-2 text-slate-500 transition-all hover:bg-red-50 hover:text-red-500"
				title="Выйти"
				@click="authStore.logout()"
			>
				<LogOut :size="20" />
			</button>
		</div>
	</header>
</template>
