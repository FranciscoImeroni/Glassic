import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateModeloDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;
}