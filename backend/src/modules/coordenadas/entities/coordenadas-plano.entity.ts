import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Modelo } from '../../formulas/entities/modelo.entity';

@Entity('coordenadas_plano')
@Index(['modelo', 'variableCodigo'], { unique: true }) // Una variable solo puede tener una posición por modelo
export class CoordenadasPlano {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Modelo, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'modelo_id' })
  modelo: Modelo;

  @Column({ name: 'modelo_id' })
  modeloId: string;

  // Código de la variable (HPF1, BPF1, HPF2, etc.)
  @Column({ name: 'variable_codigo', type: 'varchar', length: 20 })
  variableCodigo: string;

  // Coordenadas en píxeles (relativas a la imagen del plano)
  @Column({ name: 'x', type: 'int' })
  x: number;

  @Column({ name: 'y', type: 'int' })
  y: number;

  // Estilos de texto
  @Column({ name: 'font_size', type: 'int', default: 14 })
  fontSize: number;

  @Column({ name: 'font_family', type: 'varchar', length: 50, default: 'Arial' })
  fontFamily: string;

  @Column({ name: 'font_weight', type: 'varchar', length: 20, default: 'normal' })
  fontWeight: string; // normal, bold

  @Column({ name: 'color', type: 'varchar', length: 7, default: '#000000' })
  color: string; // Hexadecimal

  @Column({ name: 'align', type: 'varchar', length: 10, default: 'left' })
  align: string; // left, center, right

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
