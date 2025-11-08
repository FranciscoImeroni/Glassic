import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateComprobanteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  descripcion?: string;
}
