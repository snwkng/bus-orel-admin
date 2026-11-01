const META_FIELDS = ['_id', 'createdAt', 'updatedAt'];

export const omitMetaFields = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map(omitMetaFields) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !META_FIELDS.includes(key))
        .map(([key, val]) => [key, omitMetaFields(val)])
    ) as T;
  }
  return value;
};
