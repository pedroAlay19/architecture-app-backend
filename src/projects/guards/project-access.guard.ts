import {
  CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import type { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Project } from '../entities/project.entity';
import { MESSAGES } from '../../common/constants/messages.constants';

export interface ProjectRequest extends Request {
  user?: User;
  project?: Project;
}

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ProjectRequest>();
    const user = request.user;
    const projectId = request.params.projectId as string;

    if (!user) throw new UnauthorizedException();
    if (!isUUID(projectId)) throw new NotFoundException(MESSAGES.PROJECTS.NOT_FOUND);

    const project = await this.projectRepository.findOne({
      where: { id: projectId, contractor: { id: user.id } },
    });
    if (!project) throw new NotFoundException(MESSAGES.PROJECTS.NOT_FOUND);

    request.project = project;
    return true;
  }
}