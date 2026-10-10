import { ref, readonly } from 'vue';

const isExpanded = ref<boolean>(localStorage.getItem('isExpanded') === 'true' || false);

export const useExpanded = () => {
  const changeExpanded = (val: boolean) => {
    isExpanded.value = val;
    localStorage.setItem('isExpanded', val.toString());
  };

  return {
    isExpanded: readonly(isExpanded), // Компоненты только читают список
    changeExpanded
  };
};