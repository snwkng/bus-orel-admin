import { h } from 'vue';
import { RouterLink, type RouteLocationAsRelativeGeneric } from 'vue-router';
import dayjs from 'dayjs';
import CoverImage from '@/shared/ui/CoverImage.vue';

export const imageFormat = (val: string[]) => {
  return h(CoverImage, { images: val });
};

export const linkFormat = (title: string, route: RouteLocationAsRelativeGeneric) => {
  return h(
    RouterLink,
    { to: route, class: 'text-teal-link hover:underline' },
    () => title
  );
};

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
});

export const formatPrice = (val: number): string => priceFormatter.format(val ?? 0);

export const priceFormat = (val: number) => {
  return h(
    'span',
    null,
    formatPrice(val)
  );
};

export const dateFormat = (val: Date | string, format: string) => {
  return h(
    'div',
    null,
    dayjs(val).format(format)
  );
};