import { PartialType } from '@nestjs/mapped-types';
import { CreateValorFijoDto } from './create-configuracion.dto';

export class UpdateValorFijoDto extends PartialType(CreateValorFijoDto) {}
