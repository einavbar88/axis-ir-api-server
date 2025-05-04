import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssetDto {
  @IsOptional()
  @IsString()
  assetGroupId?: string;

  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsOptional()
  @IsInt()
  parentAssetId?: number;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  operatingSystem?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  tlp?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastHeartbeat?: Date;
}
