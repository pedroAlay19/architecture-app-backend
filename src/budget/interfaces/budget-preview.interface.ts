import { Unit } from '../constants/units';

export interface PreviewItem {
  code: string | null;
  description: string;
  unit: Unit;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PreviewCategory {
  name: string;
  subtotal: number;
  items: PreviewItem[];
}

export interface BudgetPreview {
  categories: PreviewCategory[];
  summary: { categories: number; items: number; total: number };
  warnings: string[];
}