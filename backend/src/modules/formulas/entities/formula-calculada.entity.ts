import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { VariableCalculada } from './formula.entity';
import { Modelo } from './modelo.entity';

@Entity('formulas_calculadas')
@Index(['modelo', 'variable'], { unique: true }) // Índice único compuesto
export class FormulaCalculada {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Modelo, modelo => modelo.formulas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'modelo_id' })
  modelo: Modelo;

  @Column({ name: 'modelo_id' })
  modeloId: number;

  @ManyToOne(() => VariableCalculada, variable => variable.formulas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variable_id' })
  variable: VariableCalculada;

  @Column({ name: 'variable_id' })
  variableId: number;

  @Column({ name: 'expresion', type: 'text' })
  expresion: string; // La fórmula como string: "ALT1-7", "SI(ALT1>1600;900;700)", etc.

  @Column({ name: 'orden', type: 'int', default: 0 })
  orden: number; // Para resolver dependencias entre variables

  @Column({ name: 'activa', type: 'boolean', default: true })
  activa: boolean; // Para poder desactivar fórmulas sin eliminarlas

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}