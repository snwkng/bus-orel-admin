import * as yup from 'yup';
export const excursionSchema = yup.object({
  page: yup.number().default(1).transform(v => Number.isNaN(v) ? 1 : v),
  limit: yup.number().default(10),
  search: yup.string().default(undefined),
  sortBy: yup.string().default('createdAt'),
  sortDir: yup.string().oneOf(['asc', 'desc']).default('desc')
});

export type ExcursionFilters = yup.InferType<typeof excursionSchema>;