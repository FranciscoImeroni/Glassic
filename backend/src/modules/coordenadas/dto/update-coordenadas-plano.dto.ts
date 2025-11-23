import { PartialType } from '@nestjs/mapped-types';
import { CreateCoordenadasPlanoDto } from './create-coordenadas-plano.dto';

export class UpdateCoordenadasPlanoDto extends PartialType(CreateCoordenadasPlanoDto) {}
