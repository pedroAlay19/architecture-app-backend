import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { BudgetService } from '../budget/budget.service';

@Injectable()
export class ProjectsService {
  
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    private readonly budgetService: BudgetService
  ) {}

  async create(createProjectDto: CreateProjectDto, contractor: User) {
      const {startDate, durationDays, ...projectDetails } = createProjectDto;
      

      const estimatedEndDate = this.calculateEstimatedEndDate(startDate, durationDays);

      const project = this.projectRepository.create({
        ...projectDetails,
        startDate,
        durationDays,
        estimatedEndDate,
        contractor
      });

    try {

      const saved = await this.projectRepository.save(project);
      return {id: saved.id};

    } catch (error) {
      throw new InternalServerErrorException('Could not create the project');
    }
  }

  async findAll(contractor: User, status?: ProjectStatus) {
    return await this.projectRepository.find({
      where: {
        contractor: {id: contractor.id},
        ...(status && {status})
      },
      order: {createdAt: 'DESC'}
    });
  }

  async findOne(project: Project) {
    const budget = await this.budgetService.getTree(project.id);

    return {
      ...project,
      budget: { ...budget, hasBudget: budget.categories.length > 0 },
    };
  }
  
  private calculateEstimatedEndDate(startDate: string, durationDays: number): string {
    const date = new Date(`${startDate.slice(0, 10)}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + durationDays);
    return date.toISOString().split('T')[0];
  }
}
