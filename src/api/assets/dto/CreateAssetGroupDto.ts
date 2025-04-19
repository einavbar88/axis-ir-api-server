import { IsString } from 'class-validator';

export class CreateAssetGroupDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  companyId: string;
}
