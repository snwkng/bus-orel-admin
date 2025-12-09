import type { IExcursion } from '@/entities/excursions/model/types';
import { useExcursionStore } from '@/entities/excursions/model';
import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { onInvalidSubmit } from '@/shared/config/composables/useHelpers';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

const schema = yup.object({
  name: yup.string().required('Укажите название экскурсии').defined(),
  description: yup.array().defined(),
  images: yup.array().defined(),
  duration: yup.number().nullable().defined().transform((value, originalValue) => originalValue === '' ? null : value),
  price: yup.number().nullable().defined().transform((value, originalValue) => originalValue === '' ? null : value),
  documentName: yup.array().defined(),
  excursionStartDates: yup.array().defined(),
  cities: yup.array().defined(),
  hotelName: yup.string().defined(),
  thePriceIncludes: yup.array().defined()
}) as yup.ObjectSchema<IExcursion>;

export function useExcursionForm(exId?: string) {

  const {
    validate,
    values,
    errors,
    resetForm,
    meta,
    isSubmitting,
  } = useForm<IExcursion>({
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
      thePriceIncludes: []
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
      const res = await editExcursion({ ...values, _id: exId }) as IExcursion;
      resetForm({
        values: res,
      });
    } else {
      await createExcursion(values);
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

  return { values, meta, errors, isSubmitting, buttonTitle, citiesList, validate, resetForm, loadExcursion, saveExcursion, handleSubmit, getCitiesList };
}