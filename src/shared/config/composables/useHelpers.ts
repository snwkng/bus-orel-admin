import type { GenericObject } from 'vee-validate';

export async function onInvalidSubmit({ errors }: GenericObject) {
	const keys = Object.keys(errors);
	if (keys?.length) {
		document.getElementById(keys[0])?.scrollIntoView({ behavior: 'smooth' });
	}
};