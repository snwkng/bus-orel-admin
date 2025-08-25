// features/busTourForm/composables/useBusTourForm.ts
import { ref } from 'vue';
import type { IExcursion } from '@/entities/excursions/model/types';
import { useExcursionStore } from '@/entities/excursions/model';
import { storeToRefs } from 'pinia';

export function useExcursionForm(type: string, id?: string) {
  const excursion = ref<IExcursion>({
    _id: '',
    name: '',
    description: [],
    images: [],
    duration: 0,
    price: 0,
    documentName: [],
    excursionStartDates: [],
    cities: [] as string[],
    hotelName: '',
    thePriceIncludes: []
  });

  const { createExcursion, editExcursion, getExcursion, getCitiesList } = useExcursionStore();
  const { citiesList } = storeToRefs(useExcursionStore());

  const loadExcursion = async () => {
    if (type === 'edit' && id) {
      const res = await getExcursion(id);
      Object.assign(excursion.value, res);
    }
  };

  const saveExcursion = async (value: IExcursion) => {
    if (type === 'create') {
      delete value._id;
      await createExcursion(value);
    } else {
      excursion.value = await editExcursion(value) as IExcursion;
    }
  };

  return { excursion, citiesList, loadExcursion, saveExcursion, getCitiesList };
}