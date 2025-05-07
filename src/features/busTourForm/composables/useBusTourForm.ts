// features/busTourForm/composables/useBusTourForm.ts
import { ref } from 'vue';
import { useBusTourStore } from '@/entities/busTours/model';
import type { IHotelRoomInfo, ITour } from '@/entities/busTours/model/types';

export function useBusTourForm(type: string, id?: string) {
  const busTour = ref<ITour>({
    _id: '',
    name: '',
    type: '',
    locationDescription: '',
    images: [] as string[],
    tours: [] as IHotelRoomInfo[],
    food: '',
    beach: '',
    distanceToBeach: '',
    checkInConditions: '',
    address: '',
    price: 0,
    thePriceIncludes: [''],
    city: null,
    region: '',
    seaType: '',
    documentName: '',
  });

  const { createTour, editTour, getTour } = useBusTourStore();

  const loadTour = async () => {
    if (type === 'edit' && id) {
      const tour = await getTour(id);
      Object.assign(busTour.value, tour);
    }
  };

  const saveTour = async () => {
    if (type === 'create') {
      delete busTour?.value?._id
      await createTour(busTour.value);
    } else {
      await editTour(busTour.value);
    }
  };

  return { busTour, loadTour, saveTour };
}