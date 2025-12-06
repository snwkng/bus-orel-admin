// features/busTourForm/composables/useBusTourForm.ts
import { ref } from 'vue';
import { useBusTourStore } from '@/entities/busTours/model';
import type { ITour } from '@/entities/busTours/model/types';
import { storeToRefs } from 'pinia';

export function useBusTourForm(type: string, id?: string) {
  const busTour = ref<ITour>({
    name: '',
    type: '',
    description: '',
    address: {
      city: '',
      region: '',
      country: '',
      fullAddress: '',
    },
    additionalInfo: {
      food: {
        included: false,
        type: '',
      },
      beach: {
        type: '',
        distanceMinutes: NaN,
      },
      checkInOut: {
        checkIn: '',
        checkOut: '',
      },
    },
    minPrice: NaN,
    includedInThePrice: [],
    images: [],
    seaType: '',
    documentName: [],
    tours: [],
    published: false,
  });

  const { createTour, editTour, getTour, getCitiesList } = useBusTourStore();
  const { citiesList } = storeToRefs(useBusTourStore());
  const loadTour = async () => {
    if (type === 'edit' && id) {
      const tour = await getTour(id);
      Object.assign(busTour.value, tour);
    }
  };

  const saveTour = async (values: ITour) => {
    if (type === 'create') {
      // delete busTour?.value?._id;
      await createTour(values);
    } else {
      await editTour(values);
    }
  };

  return { busTour, citiesList, loadTour, saveTour, getCitiesList };
}