import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  company_id!: number;

  @IsInt()
  case_id!: number;

  @IsInt()
  created_by!: number;

  @IsOptional()
  @IsString()
  title!: string;

  @IsOptional()
  @IsInt()
  was_sent!: boolean;

  @IsOptional()
  @IsString()
  tlp!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  report_file_s3_path!: string;
}
