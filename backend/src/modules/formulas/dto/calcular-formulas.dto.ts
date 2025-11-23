import { IsObject, IsUUID } from 'class-validator';

export class CalcularFormulasDto {
  @IsUUID()
  modeloId: string;

  @IsObject()
  valoresEntrada: Record<string, number>; // { VAN0: 1000, ALT1: 2000, ... }
}
