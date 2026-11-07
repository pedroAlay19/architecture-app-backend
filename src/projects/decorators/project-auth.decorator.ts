import { applyDecorators, UseGuards } from "@nestjs/common";
import { Auth } from "../../auth/decorators/auth.decorator";
import { ValidRoles } from "../../auth/interfaces/valid-roles";
import { ProjectAccessGuard } from "../guards/project-access.guard";

export function ProjectAuth(...roles: ValidRoles[]) {
  return applyDecorators(Auth(...roles), UseGuards(ProjectAccessGuard));
}