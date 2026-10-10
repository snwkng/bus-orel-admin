import { StorageKey } from '@/shared/config/storage-keys';
import * as yup from 'yup';

const getSavedLimit = () => {
  const saved = localStorage.getItem(StorageKey.PER_PAGE);
  return saved ? Number(saved) : 10;
};

export const excursionSchema = yup.object({
  page: yup.number().default(1).transform(v => Number.isNaN(v) ? 1 : v),
  limit: yup.number().oneOf([10, 20, 50], 'Недопустимый лимит').default(() => {
    const saved = getSavedLimit();
    return [10, 20, 50].includes(saved) ? saved : 10;
  }),
  search: yup.string().default(undefined),
  sortBy: yup.string().default('createdAt'),
  sortDir: yup.string().oneOf(['asc', 'desc']).default('desc')
});

export type ExcursionFilters = yup.InferType<typeof excursionSchema>;