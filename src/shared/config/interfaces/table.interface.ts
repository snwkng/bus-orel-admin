
export interface ITableDataConfig {
  label: string;
  propertyName: string;
  cellWidth?: string;
  dataType?: 'text' | 'date' | 'money' | 'image' | 'arrayString';
}

