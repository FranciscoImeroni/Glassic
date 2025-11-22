import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CreateCoordenadasPlantillaDto {
  @IsString()
  elemento: string;

  @IsInt()
  x: number;

  @IsInt()
  y: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  width?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  height?: number;

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
