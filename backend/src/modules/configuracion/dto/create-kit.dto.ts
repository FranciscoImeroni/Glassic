import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateKitDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  serieMampara: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreKit: string;
}