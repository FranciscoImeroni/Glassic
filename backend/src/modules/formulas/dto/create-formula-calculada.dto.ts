import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateFormulaCalculadaDto {
  @IsNumber()
  @IsNotEmpty()
  modeloId: number;

  @IsNumber()
  @IsNotEmpty()
  variableId: number;

  @IsString()
  @IsNotEmpty()
  expresion: string;

  @IsNumber()
  @IsOptional()
  orden?: number = 0;

  @IsBoolean()
  @IsOptional()
  activa?: boolean = true;
}