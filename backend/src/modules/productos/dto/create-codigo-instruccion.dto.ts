import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCodigoInstruccionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  instruccion: string;
}
