import { Controller, Get, Post, Body, Query, ParseEnumPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ProjectStatus } from './entities/project.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Auth()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() contractor: User
  ) {
    return this.projectsService.create(createProjectDto, contractor);
  }

  @Get()
  @Auth()
  findAll(
    @GetUser() contractor: User,
    @Query('status', new ParseEnumPipe(ProjectStatus, {optional: true})) status?: ProjectStatus,
  ) {
    return this.projectsService.findAll(contractor, status);
  }
}
