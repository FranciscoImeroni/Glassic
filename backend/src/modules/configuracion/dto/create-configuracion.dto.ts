import { IsString, IsNumber, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateValorFijoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  valorMm: number;
}