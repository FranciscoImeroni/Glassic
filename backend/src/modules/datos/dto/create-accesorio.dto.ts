import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAccesorioDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
