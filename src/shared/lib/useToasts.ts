import { ref, readonly } from 'vue'

export interface ToastItem {
  id: number
  message: string
  type: 'info' | 'success' | 'error'
}

const toasts = ref<ToastItem[]>([])

export const useToast = () => {
  const show = (message: string, type: ToastItem['type'] = 'info', duration = 3000) => {
    console.log('show')
    const id = Date.now()
    const newAlert: ToastItem = { id, message, type }
    
    // Добавляем в начало или конец (зависит от того, где выводите)
    toasts.value.push(newAlert)

    // Автоудаление через указанное время
    setTimeout(() => {
      remove(id)
    }, duration)
  }

  const remove = (id: number) => {
    toasts.value = toasts.value.filter(a => a.id !== id)
  }

  return {
    toasts: readonly(toasts), // Компоненты только читают список
    show,
    remove
  }
}