import { IsInt, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateIndicatorDto {
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  classification?: string;

  @IsOptional()
  @IsInt()
  priority?: number;

  @IsOptional()
  @IsInt()
  classifiedBy?: number;

  @IsOptional()
  @IsDate()
  detectedAt?: Date;

  @IsOptional()
  @IsString()
  tlp?: string;

  @IsInt()
  caseId: number;

  @IsInt()
  assetId: number;

  @IsString()
  linkType: string;

  @IsOptional()
  @IsString()
  attackPhase?: string;

  @IsOptional()
  @IsString()
  confidence?: string;
}
