import { IsInt, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  cin: string;

  @IsString()
  name: string;

  @IsString()
  industry: string | null;

  @IsString()
  address: string | null;

  @IsString()
  primaryEmail: string;

  @IsString()
  primaryPhone: string | null;

  @IsInt()
  isActive: boolean | null;

  @IsString()
  description: string | null;
}
