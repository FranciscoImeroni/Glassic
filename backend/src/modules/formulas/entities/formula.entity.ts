import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FormulaCalculada } from './formula-calculada.entity';

@Entity('variables_calculadas')
export class VariableCalculada {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo', unique: true, length: 20 })
  codigo: string; // HPF1, HPF2, BPF1, BPF2, etc.

  @Column({ name: 'descripcion', length: 255 })
  descripcion: string; // Altura Paño Fijo 1, Base Paño Fijo 1, etc.

  @Column({ name: 'tipo_salida', type: 'enum', enum: ['number', 'string'], default: 'number' })
  tipoSalida: 'number' | 'string'; // Para diferenciar valores numéricos de códigos de kit

  @OneToMany(() => FormulaCalculada, formulaCalculada => formulaCalculada.variable)
  formulas: FormulaCalculada[];

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}