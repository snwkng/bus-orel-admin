import { type VNode } from 'vue';
export interface ITableConfig<T = unknown> {
  label: string;
  propertyName: string;
  cellWidth?: string;
  format?(val: never, row: T): string | number | VNode | VNode[];
}

