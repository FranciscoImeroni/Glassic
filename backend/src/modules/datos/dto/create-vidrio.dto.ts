import { IsString, IsOptional } from 'class-validator';

export class CreateVidrioDto {
  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  color?: string;
}
