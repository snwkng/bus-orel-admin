import { defineStore } from 'pinia';

export const useUnsavedChangesStore = defineStore('unsaved-changes', {
	state: () => ({
		dirty: false
	}),
	actions: {
		setDirty(value: boolean) {
			this.dirty = value;
		}
	}
});
