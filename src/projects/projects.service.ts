import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProjectsService {
  
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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
      const {contractor, ...result} = saved
      return result;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Could not create the project');
    }
  }

  async findAll(contractor: User, status?: ProjectStatus) {
    const projects = await this.projectRepository.find({
      where: {
        contractor: {id: contractor.id},
        ...(status && {status})
      },
      order: {createdAt: 'DESC'}
    });

    return {projects};
  }

  private calculateEstimatedEndDate(startDate: string, durationDays: number): string {
    const date = new Date(`${startDate.slice(0, 10)}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + durationDays);
    return date.toISOString().split('T')[0];
  }
}
