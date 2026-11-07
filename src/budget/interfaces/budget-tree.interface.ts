export interface BudgetTreeItem {
  id: string;
  code: string | null;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BudgetTreeCategory {
  id: string;
  name: string;
  subtotal: number;
  items: BudgetTreeItem[];
}

export interface BudgetTree {
  categories: BudgetTreeCategory[];
  total: number;
}