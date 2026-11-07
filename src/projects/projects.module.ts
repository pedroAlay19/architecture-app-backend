import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { AuthModule } from '../auth/auth.module';
import { BudgetModule } from '../budget/budget.module';
import { ProjectBudgetController } from './budget/project-budget.controller';
import { ProjectBudgetService } from './budget/project-budget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    AuthModule,
    BudgetModule
  ],
  controllers: [ProjectsController, ProjectBudgetController],
  providers: [ProjectsService, ProjectBudgetService],
})
export class ProjectsModule {}
