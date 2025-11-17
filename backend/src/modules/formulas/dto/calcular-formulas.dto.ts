import { IsInt, IsObject } from 'class-validator';

export class CalcularFormulasDto {
  @IsInt()
  modeloId: number;

  @IsObject()
  valoresEntrada: Record<string, number>; // { VAN0: 1000, ALT1: 2000, ... }
}
