import { PartialType } from '@nestjs/mapped-types';
import { CreateVidrioDto } from './create-vidrio.dto';

export class UpdateVidrioDto extends PartialType(CreateVidrioDto) {}
