import { IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCoordenadasPlanoDto } from './create-coordenadas-plano.dto';

export class BatchCoordenadasPlanoDto {
  @IsInt()
  modeloId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCoordenadasPlanoDto)
  coordenadas: CreateCoordenadasPlanoDto[];
}
