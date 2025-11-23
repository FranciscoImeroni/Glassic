import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateFormulaCalculadaDto {
  @IsUUID()
  @IsNotEmpty()
  modeloId: string;

  @IsUUID()
  @IsNotEmpty()
  variableId: string;

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