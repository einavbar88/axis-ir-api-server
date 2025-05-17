import { IsInt, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateTaskDto {
  @IsOptional()
  @IsInt()
  caseId?: number;

  @IsOptional()
  @IsInt()
  iocId?: number;

  @IsOptional()
  @IsInt()
  assetId?: number;

  @IsOptional()
  @IsInt()
  assetGroupId?: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDate()
  dueDate?: Date;
}

export class UpdateTaskDto {
  @IsInt()
  taskId: number;

  @IsOptional()
  @IsInt()
  caseId?: number;

  @IsOptional()
  @IsInt()
  iocId?: number;

  @IsOptional()
  @IsInt()
  assetId?: number;

  @IsOptional()
  @IsInt()
  assetGroupId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDate()
  dueDate?: Date;
}
