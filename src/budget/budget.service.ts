import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetCategory } from './entities/budget-category.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { MAX_ITEMS } from './constants/budget-import.constants';
import { MESSAGES } from '../common/constants/messages.constants';
import { Project } from '../projects/entities/project.entity';
import { sumItems, toCategoryEntities } from './utils/budget.utils';
import { BudgetTree, BudgetTreeCategory } from './interfaces/budget-tree.interface';
import { itemTotal, round2 } from './utils/money';

@Injectable()
export class BudgetService {

  constructor(
    @InjectRepository(BudgetCategory)
    private readonly budgetCategoryRepository: Repository<BudgetCategory>,

    private readonly dataSource: DataSource
  ) {}

  async hasBudget(projectId: string): Promise<boolean> {
    return this.budgetCategoryRepository.exists({ where: { project: { id: projectId } } })
  }

  async createFromPreview(projectId: string, dto: CreateBudgetDto) {
    const itemCount = dto.categories.reduce((sum, c) => sum + c.items.length, 0);
    if (itemCount > MAX_ITEMS) {
      throw new BadRequestException(MESSAGES.BUDGET.TOO_MANY_ITEMS(MAX_ITEMS));
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.findOne(Project, {
        where: {id: projectId},
        lock: {mode: 'pessimistic_write'}
      });

      const existing = await manager.count(BudgetCategory, {
        where: { project: { id: projectId } },
      });

      if (existing > 0) throw new ConflictException(MESSAGES.BUDGET.ALREADY_EXISTS);

      const categories = toCategoryEntities(dto.categories).map((category) => 
        manager.create(BudgetCategory, {...category, project: { id: projectId }})
      );

      await manager.save(categories)
    })
  }

  async deleteByProject(projectId: string) {
    const categories = await this.budgetCategoryRepository.find({
      where: { project: { id: projectId } },
      select: {id: true}
    });

    if (categories.length) {
      await this.budgetCategoryRepository.delete(categories.map((c) => c.id));
    }
  }

  async getTree(projectId: string): Promise<BudgetTree> {
    const categories = await this.budgetCategoryRepository.find({
      where: { project: { id: projectId } },
      relations: { items: true },
      order: { order: 'ASC', items: { order: 'ASC' } },
    });

    const mapped: BudgetTreeCategory[] = categories.map((category) => ({
      id: category.id,
      name: category.name,
      subtotal: sumItems(category.items),
      items: category.items.map((item) => ({
        id: item.id,
        code: item.code,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal(item.quantity, item.unitPrice),
      })),
    }));

    return {
      categories: mapped,
      total: round2(mapped.reduce((sum, c) => sum + c.subtotal, 0)),
    };
  }
}
