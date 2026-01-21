import type { CreateExcursionDto } from '@/entities/excursions/model/types';
import { useExcursionStore } from '@/entities/excursions/model';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { onInvalidSubmit } from '@/shared/config/composables/useHelpers';
import * as yup from 'yup';
import { computed } from 'vue';

const schema = yup.object({
  name: yup.string().required('Укажите название экскурсии').defined().typeError('Поле должно быть текстовым'),
  description: yup.array().of(yup.string()).defined(),
  images: yup.array().of(yup.string()).defined(),
  duration: yup.number().nullable().defined().transform((value, originalValue) => originalValue === '' || originalValue === 0 ? null : +value).typeError('Поле должно быть числом'),
  price: yup.number().required('Укажите цену').min(1, 'Цена должна быть больше 0').defined().typeError('Поле должно быть числом'),
  documentName: yup.array().of(yup.string()).max(1, 'Максимум 1 файл').defined(),
  excursionStartDates: yup.array().of(yup.string()).defined(),
  cities: yup.array().of(yup.string()).defined(),
  hotelName: yup.string().defined(),
  thePriceIncludes: yup.array().of(yup.string()).defined(),
  additionallyPaid: yup.array().of(yup.string()).defined()
}) as yup.ObjectSchema<CreateExcursionDto>;

export function useExcursionForm(exId?: string) {

  const {
    validate,
    values,
    errors,
    resetForm,
    meta,
    isSubmitting,
  } = useForm<CreateExcursionDto>({
    validationSchema: schema,
    initialValues: {
      name: '',
      description: [],
      images: [],
      duration: 0,
      price: 0,
      documentName: [],
      excursionStartDates: [],
      cities: [] as string[],
      hotelName: '',
      thePriceIncludes: [],
      additionallyPaid: []
    },
    validateOnMount: false,
  });



  const { createExcursion, editExcursion, getExcursion, getCitiesList } = useExcursionStore();
  const { citiesList } = storeToRefs(useExcursionStore());

  const buttonTitle = computed(() => exId ? 'Сохранить' : 'Создать экскурсию');

  const loadExcursion = async () => {
    if (exId) {
      const res = await getExcursion(exId);
      resetForm({
        values: res,
      });
    }
  };

  const saveExcursion = async () => {
    if (exId) {
      const res = await editExcursion({ ...schema.cast(values), _id: exId });
      resetForm({
        values: res,
      });
    } else {
      await createExcursion(schema.cast(values));
    }
  };

  const handleSubmit = async () => {
    const result = await validate();
    if (!result.valid) {
      return onInvalidSubmit(errors.value);
    }
    await saveExcursion();
    return true;
  };

  return {
    meta,
    citiesList,
    isSubmitting,
    buttonTitle,
    loadExcursion,
    getCitiesList,
    handleSubmit
  };
}