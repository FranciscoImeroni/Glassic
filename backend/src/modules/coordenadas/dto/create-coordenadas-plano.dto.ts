import { IsInt, IsString, IsOptional, Min, IsUUID } from 'class-validator';

export class CreateCoordenadasPlanoDto {
  @IsUUID()
  modeloId: string;

  @IsString()
  variableCodigo: string;

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
