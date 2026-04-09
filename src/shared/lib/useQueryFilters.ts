import { computed } from 'vue';
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router';
import { type InferType, ObjectSchema } from 'yup';
import { StorageKey } from '@/shared/config/storage-keys';
import { debounce } from './useDebounces';

// T extends ObjectSchema<any> позволяет передать любую схему объекта Yup
export function useQueryFilters<T extends ObjectSchema<any>>(schema: T) {
  const router = useRouter();
  const route = useRoute();

  // Автоматический вывод типа из схемы Yup
  type FilterType = InferType<T>;

  const filters = computed<FilterType>(() => {
    try {
      // cast() превращает строки из URL в нужные типы (number, boolean)
      // stripUnknown: true удаляет параметры, которых нет в схеме
      return schema.cast(route.query, { stripUnknown: true }) as FilterType;
    } catch {
      // Если валидация не прошла, возвращаем дефолтное состояние схемы
      return schema.getDefault() as FilterType;
    }
  });

    const debouncedNavigate = debounce(
    (query: LocationQueryRaw, replace: boolean) => {
      router[replace ? 'replace' : 'push']({ query })
    },
    150
  )

  const updateFilters = (patch: Partial<FilterType>, options?: { replace?: boolean; }) => {
    
    const combined = { ...route.query, ...patch };

    const defaultValues = schema.getDefault();

    // Очистка пустых значений
    const cleanQuery = Object.fromEntries(
      Object.entries(combined).filter(([key, value]) => {
        // Убираем, если значение null/undefined/пустое
        if (value === undefined || value === null || value === '') return false;

        // Убираем, если значение совпадает с дефолтным (например, page: 1)
        // Приводим к строке для корректного сравнения с query из URL
        if (String(value) === String(defaultValues[key])) return false;

        return true;
      })
    );

    if (patch.limit) {
      localStorage.setItem(StorageKey.PER_PAGE, String(patch.limit));
    }

    debouncedNavigate(cleanQuery as LocationQueryRaw, options?.replace ?? false)
  };

  return { filters, updateFilters };
}
