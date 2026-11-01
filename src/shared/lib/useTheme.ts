import { ref, readonly, watch } from 'vue';
import { StorageKey } from '@/shared/config/storage-keys';

const applyTheme = (dark: boolean) => {
	document.documentElement.classList.toggle('dark', dark);
};

const saved = localStorage.getItem(StorageKey.THEME);
const isDark = ref<boolean>(
	saved
		? saved === 'dark'
		: window.matchMedia('(prefers-color-scheme: dark)').matches
);
applyTheme(isDark.value);

watch(isDark, (dark) => {
	applyTheme(dark);
	localStorage.setItem(StorageKey.THEME, dark ? 'dark' : 'light');
});

export const useTheme = () => {
	const toggleTheme = () => {
		isDark.value = !isDark.value;
	};

	return {
		isDark: readonly(isDark),
		toggleTheme
	};
};
