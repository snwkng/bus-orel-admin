import { computed } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import { type InferType, ObjectSchema } from 'yup'

// T extends ObjectSchema<any> позволяет передать любую схему объекта Yup
export function useQueryFilters<T extends ObjectSchema<any>>(schema: T) {
  const router = useRouter()
  const route = useRoute()

  // Автоматический вывод типа из схемы Yup
  type FilterType = InferType<T>

  const filters = computed<FilterType>(() => {
    try {
      // cast() превращает строки из URL в нужные типы (number, boolean)
      // stripUnknown: true удаляет параметры, которых нет в схеме
      return schema.cast(route.query, { stripUnknown: true }) as FilterType
    } catch {
      // Если валидация не прошла, возвращаем дефолтное состояние схемы
      return schema.getDefault() as FilterType
    }
  })

  const updateFilters = (patch: Partial<FilterType>) => {
    const combined = { ...route.query, ...patch }
    
    // Очистка пустых значений
    const cleanQuery = Object.fromEntries(
      Object.entries(combined).filter(([_, v]) => 
        v !== undefined && v !== null && v !== ''
      )
    )

    router.push({ query: cleanQuery as LocationQueryRaw })
  }

  return { filters, updateFilters }
}
