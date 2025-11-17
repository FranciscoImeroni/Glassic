import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCoordenadasPlantillaDto } from './create-coordenadas-plantilla.dto';

export class BatchCoordenadasPlantillaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCoordenadasPlantillaDto)
  coordenadas: CreateCoordenadasPlantillaDto[];
}
