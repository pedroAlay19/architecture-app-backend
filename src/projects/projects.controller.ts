import { Controller, Get, Post, Body, Query, ParseEnumPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { Project, ProjectStatus } from './entities/project.entity';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { MESSAGES } from '../common/constants/messages.constants';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ProjectAuth } from './decorators/project-auth.decorator';
import { CurrentProject } from './decorators/current-project.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Auth(ValidRoles.architect)
  @ResponseMessage(MESSAGES.PROJECTS.CREATED)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() contractor: User
  ) {
    return this.projectsService.create(createProjectDto, contractor);
  }

  @Get()
  @Auth(ValidRoles.architect)
  @ResponseMessage(MESSAGES.PROJECTS.LIST)
  findAll(
    @GetUser() contractor: User,
    @Query('status', new ParseEnumPipe(ProjectStatus, {optional: true})) status?: ProjectStatus,
  ) {
    return this.projectsService.findAll(contractor, status);
  }

  @Get(':projectId')
  @ProjectAuth(ValidRoles.architect)
  @ResponseMessage(MESSAGES.PROJECTS.FOUND)
  findOne(@CurrentProject() project: Project) {
    return this.projectsService.findOne(project);
  }
}
