import { IsString, IsNotEmpty, MaxLength, IsEnum, IsOptional } from 'class-validator';

export class CreateVariableCalculadaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descripcion: string;

  @IsEnum(['number', 'string'])
  @IsOptional()
  tipoSalida?: 'number' | 'string' = 'number';
}