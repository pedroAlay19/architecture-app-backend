import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { ProjectRequest } from "../guards/project-access.guard";
import { Project } from "../entities/project.entity";

export const CurrentProject = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Project => {
    const request = ctx.switchToHttp().getRequest<ProjectRequest>();
    if (!request.project) {
      throw new InternalServerErrorException('ProjectAccessGuard is missing on this route');
    }
    return request.project;
  },
);