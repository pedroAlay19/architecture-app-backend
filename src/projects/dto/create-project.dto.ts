import { IsDateString, IsInt, IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(2)
    location: string;

    @IsString()
    @MinLength(2)
    client: string;

    @IsDateString()
    startDate: string;

    @IsInt()
    @Min(1)
    durationDays: number;

    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    totalBudget: number;
}
