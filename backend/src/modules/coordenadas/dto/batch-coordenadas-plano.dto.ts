import { IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCoordenadasPlanoDto } from './create-coordenadas-plano.dto';

export class BatchCoordenadasPlanoDto {
  @IsUUID()
  modeloId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCoordenadasPlanoDto)
  coordenadas: CreateCoordenadasPlanoDto[];
}
