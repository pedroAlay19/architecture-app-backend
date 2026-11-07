import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetImportService } from './budget-import.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetCategory } from './entities/budget-category.entity';
import { BudgetItem } from './entities/budget-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BudgetCategory, BudgetItem])],
  providers: [BudgetService, BudgetImportService],
  exports: [BudgetImportService, BudgetService],
})
export class BudgetModule {}
