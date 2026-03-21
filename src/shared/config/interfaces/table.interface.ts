import { type VNode } from 'vue';
export interface ITableConfig<T = any> {
  label: string;
  propertyName: string;
  cellWidth?: string;
  format?: (val: any, row: T) => string | number | VNode | VNode[];
}

