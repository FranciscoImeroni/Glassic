import { PartialType } from '@nestjs/mapped-types';
import { CreateCodigoInstruccionDto } from './create-codigo-instruccion.dto';

export class UpdateCodigoInstruccionDto extends PartialType(CreateCodigoInstruccionDto) {}
