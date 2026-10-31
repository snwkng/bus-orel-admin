import { h } from 'vue';
import { RouterLink, type RouteLocationAsRelativeGeneric } from 'vue-router';
import dayjs from 'dayjs';

export const imageFormat = (val: string[]) => {
  return h(
    'div',
    { class: 'flex flex-row flex-wrap gap-1' },
    (val || []).map((t) => h('img', { src: `/api/s3/download/${t}`, alt: t, loading: 'lazy', class: 'w-[70px] h-[70px] bg-slate-300 rounded-xl object-cover transition-all' }, t))
  );
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