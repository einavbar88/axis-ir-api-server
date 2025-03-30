import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsNumber()
  @IsOptional()
  purchasePrice?: number;

  @IsDate()
  @IsOptional()
  purchaseDate?: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsOptional()
  status?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  companyId: string;
}
