import { ConflictException, Injectable } from "@nestjs/common";
import { BudgetService } from "../../budget/budget.service";
import { BudgetImportService } from "../../budget/budget-import.service";
import { User } from "../../auth/entities/user.entity";
import { MESSAGES } from "../../common/constants/messages.constants";
import { CreateBudgetDto } from "../../budget/dto/create-budget.dto";

@Injectable()
export class ProjectBudgetService {
    constructor(
        private readonly budgetService: BudgetService,
        private readonly budgetImportService: BudgetImportService,
    ) {}

    async preview(projectId: string, buffer: Buffer) {
    
        if (await this.budgetService.hasBudget(projectId)) {
          throw new ConflictException(MESSAGES.BUDGET.ALREADY_EXISTS);
        }
    
        return this.budgetImportService.preview(buffer);
      }
    
      async create(projectId: string, dto: CreateBudgetDto) {
        await this.budgetService.createFromPreview(projectId, dto);
      }
    
      async remove(projectId: string) {
        // TODO: bloquear si ya existen avances
        await this.budgetService.deleteByProject(projectId);
    }
}