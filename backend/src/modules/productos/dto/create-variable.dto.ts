import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateVariableDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
}
