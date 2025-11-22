import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CreateCoordenadasPlanoDto {
  @IsInt()
  modeloId: number;

  @IsInt()
  variableId: number;

  @IsInt()
  x: number;

  @IsInt()
  y: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  fontSize?: number;

  @IsOptional()
  @IsString()
  fontFamily?: string;

  @IsOptional()
  @IsString()
  fontWeight?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  align?: string;
}
