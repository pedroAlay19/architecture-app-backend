import { BadRequestException, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import {
  COLUMNS,
  DATA_FIELDS,
  Field,
  MAX_ERRORS,
  MAX_ITEMS,
  MAX_ROWS_SCANNED,
  SHEET_NAME,
} from './constants/budget-import.constants';
import { UNITS, Unit } from './constants/units';
import { BudgetPreview, PreviewCategory } from './interfaces/budget-preview.interface';
import { normalize, readCell, toNumber, toText } from './utils/excel-cell.utils';
import { itemTotal, round2, round4 } from './utils/money';
import { MESSAGES } from '../common/constants/messages.constants';

@Injectable()
export class BudgetImportService {
  async preview(buffer: Buffer): Promise<BudgetPreview> {
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
    } catch {
      throw new BadRequestException(MESSAGES.FILES.INVALID_FILE);
    }

    const sheet = workbook.getWorksheet(SHEET_NAME);
    if (!sheet) {
      throw new BadRequestException(MESSAGES.BUDGET.SHEET_NOT_FOUND(SHEET_NAME));
    }

    const columns = this.mapColumns(sheet);
    console.log(columns);

    const errors: string[] = [];
    const warnings: string[] = [];
    const groups = new Map<string, PreviewCategory>();
    const seenCodes = new Set<string>();
    let itemCount = 0;

    const lastRow = Math.min(sheet.rowCount, MAX_ROWS_SCANNED);

    for (let r = 2; r <= lastRow; r++) {
      const row = sheet.getRow(r);
      const get = (field: Field): unknown =>
        columns[field] ? readCell(row.getCell(columns[field]!)) : undefined;

      if (DATA_FIELDS.every((f) => toText(get(f)) === '')) continue;

      const categoryName = toText(get('category')).replace(/\s+/g, ' ');
      const description = toText(get('description'));
      const unit = toText(get('unit')).toUpperCase();
      const quantity = toNumber(get('quantity'));
      const unitPrice = toNumber(get('unitPrice'));

      const rowErrors: string[] = [];
      if (!categoryName) rowErrors.push('CATEGORIA vacía');
      if (description.length < 2) rowErrors.push('DESCRIPCION vacía');
      if (!UNITS.includes(unit as Unit))
        rowErrors.push(`UNIDAD "${unit}" no válida (usa: ${UNITS.join(', ')})`);
      if (quantity === null || quantity <= 0)
        rowErrors.push('CANTIDAD debe ser un número mayor que 0');
      if (unitPrice === null || unitPrice < 0)
        rowErrors.push('PRECIO_UNITARIO debe ser un número mayor o igual a 0');

      if (rowErrors.length) {
        errors.push(`Fila ${r}: ${rowErrors.join('; ')}`);
        continue;
      }

      itemCount++;
      if (itemCount > MAX_ITEMS) {
        throw new BadRequestException(MESSAGES.BUDGET.TOO_MANY_ITEMS(MAX_ITEMS));
      }

      const qty = round4(quantity!);
      const price = round2(unitPrice!);
      const total = itemTotal(qty, price);

      if (Math.abs(price - unitPrice!) > 1e-6)
        warnings.push(`Fila ${r}: PRECIO_UNITARIO redondeado a 2 decimales (${price})`);

      const fileTotal = toNumber(get('total'));
      if (fileTotal !== null && Math.abs(fileTotal - total) > 0.01)
        warnings.push(
          `Fila ${r}: PRECIO_TOTAL del archivo (${fileTotal}) no coincide con cantidad × precio (${total})`,
        );

      const code = toText(get('code')) || null;
      if (code) {
        if (seenCodes.has(code)) warnings.push(`Fila ${r}: CODIGO "${code}" repetido`);
        seenCodes.add(code);
      }

      const key = categoryName.toUpperCase();
      if (!groups.has(key)) {
        groups.set(key, { name: categoryName, subtotal: 0, items: [] });
      }
      groups.get(key)!.items.push({
        code,
        description,
        unit: unit as Unit,
        quantity: qty,
        unitPrice: price,
        total,
      });
    }

    if (errors.length) {
      const shown = errors.slice(0, MAX_ERRORS);
      if (errors.length > MAX_ERRORS)
        shown.push(`...y ${errors.length - MAX_ERRORS} errores más`);
      throw new BadRequestException(shown);
    }

    if (itemCount === 0) {
      throw new BadRequestException(MESSAGES.BUDGET.EMPTY);
    }

    const categories = Array.from(groups.values()).map((category) => ({
      ...category,
      subtotal: round2(category.items.reduce((sum, i) => sum + i.total, 0)),
    }));

    return {
      categories,
      summary: {
        categories: categories.length,
        items: itemCount,
        total: round2(categories.reduce((sum, c) => sum + c.subtotal, 0)),
      },
      warnings,
    };
  }

  private mapColumns(sheet: ExcelJS.Worksheet): Partial<Record<Field, number>> {
    const columns: Partial<Record<Field, number>> = {};

    sheet.getRow(1).eachCell((cell, colNumber) => {
      const key = normalize(toText(readCell(cell)));
      const match = COLUMNS.find((c) => normalize(c.label) === key);
      if (match) columns[match.field] = colNumber;
    });

    const missing = COLUMNS
        .filter((c) => c.required && !columns[c.field])
        .map((c) => c.label);
    if (missing.length) {
      throw new BadRequestException(MESSAGES.BUDGET.MISSING_COLUMNS(missing));
    }

    return columns;
  }
}