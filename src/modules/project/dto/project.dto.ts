import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsNumberString, IsOptional } from "class-validator";
import { ProjectType } from "src/entities/project.entity";

export class ProjectDTO{
    id?: number;

    name?: string;

    startDate?: Date;

    endDate?: Date;

    projectType?: ProjectType 

    @IsOptional()
    @IsNumberString()
    profit?: number
}