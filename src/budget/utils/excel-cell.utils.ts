import * as ExcelJS from 'exceljs';

// "Código" -> "codigo", "PRECIO_UNITARIO" -> "preciounitario"
export const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');

// Desenvuelve fórmulas (usa el resultado en caché), texto enriquecido e hipervínculos
export const readCell = (cell: ExcelJS.Cell): unknown => {
  const value = cell.value;
  if (value === null || typeof value !== 'object' || value instanceof Date) return value;
  if ('result' in value) return value.result;
  if ('richText' in value) return value.richText.map((part) => part.text).join('');
  if ('text' in value) return value.text;
  return undefined; // celdas de error (#REF!, etc.)
};

export const toText = (value: unknown): string => {
  if (value === null || value === undefined || typeof value === 'object') return '';
  return String(value).trim();
};

export const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value.trim())) {
    return Number(value.trim());
  }
  return null;
};