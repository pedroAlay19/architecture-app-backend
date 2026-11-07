import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateBudgetCategoryDto } from './create-budget-category.dto';

export class CreateBudgetDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetCategoryDto)
  categories: CreateBudgetCategoryDto[];
}