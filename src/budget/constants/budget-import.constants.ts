export const SHEET_NAME = 'PRESUPUESTO';
export const MAX_ITEMS = 500;
export const MAX_ROWS_SCANNED = 5000;
export const MAX_ERRORS = 20;

export const COLUMNS = [
  { field: 'category', label: 'CATEGORIA', required: true },
  { field: 'code', label: 'CODIGO', required: false },
  { field: 'description', label: 'DESCRIPCION', required: true },
  { field: 'unit', label: 'UNIDAD', required: true },
  { field: 'quantity', label: 'CANTIDAD', required: true },
  { field: 'unitPrice', label: 'PRECIO_UNITARIO', required: true },
  { field: 'total', label: 'PRECIO_TOTAL', required: false },
] as const;

export type Field = (typeof COLUMNS)[number]['field'];

export const DATA_FIELDS: Field[] = [
  'category',
  'code',
  'description',
  'unit',
  'quantity',
  'unitPrice',
];