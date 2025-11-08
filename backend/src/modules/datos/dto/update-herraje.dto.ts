import { PartialType } from '@nestjs/mapped-types';
import { CreateHerrajeDto } from './create-herraje.dto';

export class UpdateHerrajeDto extends PartialType(CreateHerrajeDto) {}
