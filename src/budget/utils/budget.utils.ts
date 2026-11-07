import { CreateBudgetCategoryDto } from '../dto/create-budget-category.dto';
import { itemTotal, round2, round4 } from './money';

// Convierte lo que llega del cliente en lo que se guarda
export const toCategoryEntities = (categories: CreateBudgetCategoryDto[]) =>
  categories.map((category, categoryIndex) => ({
    name: category.name.trim(),
    order: categoryIndex,
    items: category.items.map((item, itemIndex) => ({
      code: item.code?.trim() || null,
      description: item.description.trim(),
      unit: item.unit,
      quantity: round4(item.quantity),
      unitPrice: round2(item.unitPrice),
      order: itemIndex,
    })),
  }));

// Una sola definición de "cuánto suman estos rubros"
export const sumItems = (items: { quantity: number; unitPrice: number }[]): number =>
  round2(items.reduce((sum, item) => sum + itemTotal(item.quantity, item.unitPrice), 0));