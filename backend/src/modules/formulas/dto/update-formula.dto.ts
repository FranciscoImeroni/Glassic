import { PartialType } from '@nestjs/mapped-types';
import { CreateVariableCalculadaDto } from './create-formula.dto';

export class UpdateVariableCalculadaDto extends PartialType(CreateVariableCalculadaDto) {}
