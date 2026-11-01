import { defineStore } from 'pinia'
import { computed } from 'vue'

export interface ToastItem {
  id: number
  message: string
  type: 'info' | 'success' | 'error'
}

let nextId = 1

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as ToastItem[]
  }),
  actions: {
    show(message: string, type: ToastItem['type'] = 'info', duration = 3000) {
      const id = nextId++
      this.toasts.push({ id, message, type })

      setTimeout(() => {
        this.remove(id)
      }, duration)
    },
    remove(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    }
  }
})

export const useToast = () => {
  const store = useToastStore()

  return {
    toasts: computed(() => store.toasts),
    show: store.show,
    remove: store.remove
  }
}
