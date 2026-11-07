import { ArrayMaxSize, ArrayMinSize, IsArray, IsString, MinLength, ValidateNested } from "class-validator";
import { CreateBudgetItemDto } from "./create-budget-item.dto";
import { Type } from "class-transformer";

export class CreateBudgetCategoryDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(500)
    @ValidateNested({each: true})
    @Type(() => CreateBudgetItemDto)
    items: CreateBudgetItemDto[ ]
}
