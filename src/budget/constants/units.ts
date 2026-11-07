export const UNITS = ['M2', 'M3', 'ML', 'U', 'PTO', 'KG', 'GLB', 'MES'] as const;
export type Unit = (typeof UNITS)[number];