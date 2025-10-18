import { PartialType } from '@nestjs/mapped-types';
import { CreateFormulaCalculadaDto } from './create-formula-calculada.dto';

export class UpdateFormulaCalculadaDto extends PartialType(CreateFormulaCalculadaDto) {}