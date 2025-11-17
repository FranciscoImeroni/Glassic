import { PartialType } from '@nestjs/mapped-types';
import { CreateCoordenadasPlantillaDto } from './create-coordenadas-plantilla.dto';

export class UpdateCoordenadasPlantillaDto extends PartialType(CreateCoordenadasPlantillaDto) {}
