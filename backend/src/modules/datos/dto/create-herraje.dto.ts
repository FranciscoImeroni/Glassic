import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHerrajeDto {
  @IsString()
  @IsNotEmpty()
  color: string;
}
