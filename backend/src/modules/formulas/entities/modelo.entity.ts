import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FormulaCalculada } from './formula-calculada.entity';

@Entity('modelos')
export class Modelo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'codigo', unique: true, length: 50 })
  codigo: string; // 1000, 1010-i, 1010-d, 4000-Ai, 4200-A1i, etc.

  @Column({ name: 'descripcion', length: 255, nullable: true })
  descripcion: string;

  @OneToMany(() => FormulaCalculada, formulaCalculada => formulaCalculada.modelo)
  formulas: FormulaCalculada[];

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}