export const debounce = (func: Function, delayMs: number = 1000) => {
	const timeout = setTimeout(() => {
		func();
		clearTimeout(timeout);
	}, delayMs);
};