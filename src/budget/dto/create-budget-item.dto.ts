import { IsIn, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";
import { UNITS } from "../constants/units";
import type { Unit } from "../constants/units";

export class CreateBudgetItemDto {
    @IsOptional()
    @IsString()
    @MaxLength(30)
    code?: string;

    @IsString()
    @MinLength(2)
    description: string;

    @IsIn(UNITS, {
      message: (args) => `${args.property} debe ser una de: ${UNITS.join(', ')}`,
    })
    unit: Unit;

    @IsNumber({ maxDecimalPlaces: 4 })
    @IsPositive()
    quantity: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    unitPrice: number;
}