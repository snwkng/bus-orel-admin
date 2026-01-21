import { useBusTourStore } from '@/entities/busTours/model';
import type { CreateHotelDto } from '@/entities/busTours/model/types';
import { storeToRefs } from 'pinia';
import { onInvalidSubmit } from '@/shared/config/composables/useHelpers';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { computed } from 'vue';

const schema = yup.object({
  name: yup.string().required('Укажите название гостиницы').defined().typeError('Поле должно быть текстовым'),
  type: yup.string().required('Укажите тип гостиницы').defined().typeError('Поле должно быть текстовым'),
  description: yup.string().defined(),
  address: yup.object({
    city: yup.string().defined(),
    region: yup.string().defined(),
    country: yup.string().defined(),
    fullAddress: yup.string().defined(),
  }),
  additionalInfo: yup.object({
    food: yup.object({
      included: yup.boolean(),
      type: yup.string().defined(),
    }),
    beach: yup.object({
      type: yup.string().defined(),
      distanceMinutes: yup.number().nullable().defined().transform((value, originalValue) => originalValue === '' || originalValue === 0 ? null : +value).typeError('Поле должно быть числом'),
    }),
    checkInOut: yup.object({
      checkIn: yup.string().defined(),
      checkOut: yup.string().defined(),
    }),
  }),
  minPrice: yup.number().required('Укажите минимальную цену').min(1, 'Цена должна быть больше 0').defined().typeError('Поле должно быть числом'),
  includedInThePrice: yup.array().of(
    yup.object({
      serviceName: yup.string().required('Заполните или удалите поле'),
    })
  ),
  images: yup.array().of(yup.string()).defined(),
  seaType: yup.string().defined(),
  documentName: yup.array().of(yup.string()).max(1, 'Максимум 1 файл').defined(),
  rooms: yup.array().min(1, 'Добавьте хотя бы один номер').of(
    yup.object().shape({
      type: yup.string().required('Укажите тип номера').defined(),
      name: yup.string().required('Укажите название номера').defined(),
      capacity: yup.number().transform((value, originalValue) => originalValue === '' || originalValue === 0 ? null : +value).nullable().typeError('Поле должно быть числом').required('Укажите количество спальных мест').min(1, 'Количество спальных мест не может быть меньше 1'),
      inRoom: yup.string().defined(),
    })
  ),
  published: yup.boolean(),
}) as yup.ObjectSchema<CreateHotelDto>;

export function useBusTourForm(tourId?: string) {
  const {
    validate,
    values,
    errors,
    resetForm,
    meta,
    isSubmitting,
  } = useForm<CreateHotelDto>({
    validationSchema: schema,
    initialValues: {
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
          distanceMinutes: 0,
        },
        checkInOut: {
          checkIn: '',
          checkOut: '',
        },
      },
      minPrice: 0,
      includedInThePrice: [],
      images: [],
      seaType: '',
      documentName: [],
      rooms: [],
      published: false,
    },
    validateOnMount: false,
  });

  const { createTour, editTour, getTour, getCitiesList, updateStatus } = useBusTourStore();
  const { citiesList } = storeToRefs(useBusTourStore());

  const buttonTitle = computed(() => tourId ? 'Сохранить' : 'Создать тур');

  const publishTitle = computed(() => isPublished.value ? 'Снять с публикации' : 'Опубликовать');

  const isPublished = computed(() => values.published);

  const handleSubmit = async () => {
    const result = await validate();
    if (!result.valid) {
      return onInvalidSubmit(errors.value);
    }
    await saveTour();
    return true;
  };
  const loadTour = async () => {
    if (tourId) {
      const res = await getTour(tourId);
      resetForm({
        values: res,
      });
    }
  };

  const saveTour = async () => {
    if (tourId) {
      const res = await editTour({ ...values, _id: tourId });
      resetForm({
        values: res,
      });
    } else {
      await createTour(values);
    }
  };

  const changeStatus = async (published: boolean) => {
    await updateStatus(tourId as string, published);
  };

  return {
    meta,
    citiesList,
    isSubmitting,
    buttonTitle,
    isPublished,
    publishTitle,
    loadTour,
    getCitiesList,
    handleSubmit,
    changeStatus,
    values
  };
}