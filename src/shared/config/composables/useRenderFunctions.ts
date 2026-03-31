import { h } from 'vue';
import { RouterLink, type RouteLocationAsRelativeGeneric } from 'vue-router';
import dayjs from 'dayjs';

export const imageFormat = (val: string[]) => {
  return h(
    'div',
    { class: 'flex flex-row flex-wrap gap-1' },
    (val || []).map((t) => h('img', { src: `/api/s3/download/${t}`, alt: t, loading: 'lazy', class: 'w-[100px] h-[100px] rounded-xl object-cover' }, t))
  );
};

export const linkFormat = (title: string, route: RouteLocationAsRelativeGeneric) => {
  return h(
    RouterLink,
    { to: route, class: 'text-ligth-blue hover:underline' },
    () => title
  );
};

export const priceFormat = (val: number) => {
  return h(
    'span',
    null,
    `${val}₽`
  );
};

export const dateFormat = (val: Date | string, format: string) => {
  return h(
    'div',
    null,
    dayjs(val).format(format)
  );
};