import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Modelo } from '../../formulas/entities/modelo.entity';
import { VariableCalculada } from '../../formulas/entities/formula.entity';

@Entity('coordenadas_plano')
@Index(['modelo', 'variable'], { unique: true }) // Una variable solo puede tener una posición por modelo
export class CoordenadasPlano {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Modelo, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'modelo_id' })
  modelo: Modelo;

  @Column({ name: 'modelo_id' })
  modeloId: number;

  @ManyToOne(() => VariableCalculada, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'variable_id' })
  variable: VariableCalculada;

  @Column({ name: 'variable_id' })
  variableId: number;

  // Coordenadas en píxeles (relativas a la imagen del plano)
  @Column({ name: 'x', type: 'int' })
  x: number;

  @Column({ name: 'y', type: 'int' })
  y: number;

  // Estilos de texto
  @Column({ name: 'font_size', type: 'int', default: 14 })
  fontSize: number;

  @Column({ name: 'font_family', length: 50, default: 'Arial' })
  fontFamily: string;

  @Column({ name: 'font_weight', length: 20, default: 'normal' })
  fontWeight: string; // normal, bold

  @Column({ name: 'color', length: 7, default: '#000000' })
  color: string; // Hexadecimal

  @Column({ name: 'align', length: 10, default: 'left' })
  align: string; // left, center, right

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
