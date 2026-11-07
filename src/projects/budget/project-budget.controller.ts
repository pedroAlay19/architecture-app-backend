import { Body, Controller, Delete, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProjectAuth } from "../decorators/project-auth.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentProject } from "../decorators/current-project.decorator";
import { Project } from "../entities/project.entity";
import { xlsxFilePipe } from "../../common/excel/xlsx-file.pipe";
import { ProjectBudgetService } from "./project-budget.service";
import { CreateBudgetDto } from "../../budget/dto/create-budget.dto";
import { ValidRoles } from "../../auth/interfaces/valid-roles";
import { ResponseMessage } from "../../common/decorators/response-message.decorator";
import { MESSAGES } from "../../common/constants/messages.constants";

@Controller('projects/:projectId/budget')
@ProjectAuth(ValidRoles.architect)
export class ProjectBudgetController {
  constructor(private readonly projectBudgetService: ProjectBudgetService) {}

  @Post('preview')
  @ResponseMessage(MESSAGES.BUDGET.PREVIEW)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  preview(
    @CurrentProject() project: Project,
    @UploadedFile(xlsxFilePipe()) file: Express.Multer.File,
  ) {
    return this.projectBudgetService.preview(project.id, file.buffer);
  }

  @Post()
  @ResponseMessage(MESSAGES.BUDGET.CREATED)
  create(@CurrentProject() project: Project, @Body() dto: CreateBudgetDto) {
    return this.projectBudgetService.create(project.id, dto);
  }

  @Delete()
  @ResponseMessage(MESSAGES.BUDGET.DELETED)
  remove(@CurrentProject() project: Project) {
    return this.projectBudgetService.remove(project.id);
  }
}