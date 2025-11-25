import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('modelos')
export class Modelo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'codigo', unique: true, length: 50 })
  codigo: string; // 1000, 1010-i, 1010-d, 4000-Ai, 4200-A1i, etc.

  @Column({ name: 'descripcion', length: 255, nullable: true })
  descripcion: string;

  // Columnas de fórmulas
  @Column({ name: 'hpf1', type: 'text', nullable: true })
  hpf1: string; // Altura Paño Fijo 1

  @Column({ name: 'hpf2', type: 'text', nullable: true })
  hpf2: string; // Altura Paño Fijo 2

  @Column({ name: 'hpue', type: 'text', nullable: true })
  hpue: string; // Altura Puerta

  @Column({ name: 'bpf1', type: 'text', nullable: true })
  bpf1: string; // Base Paño Fijo 1

  @Column({ name: 'bpf2', type: 'text', nullable: true })
  bpf2: string; // Base Paño Fijo 2

  @Column({ name: 'bpf3', type: 'text', nullable: true })
  bpf3: string; // Base Paño Fijo 3

  @Column({ name: 'bpf4', type: 'text', nullable: true })
  bpf4: string; // Base Paño Fijo 4

  @Column({ name: 'bpu1', type: 'text', nullable: true })
  bpu1: string; // Base Puerta 1

  @Column({ name: 'bp2', type: 'text', nullable: true })
  bp2: string; // Base Paño 2

  @Column({ name: 'debi', type: 'text', nullable: true })
  debi: string; // Detalle Bisagra

  @Column({ name: 'htir', type: 'text', nullable: true })
  htir: string; // Altura Tirador

  @Column({ name: 'ckit', type: 'text', nullable: true })
  ckit: string; // Código Kit

  @Column({ name: 'hkit', type: 'text', nullable: true })
  hkit: string; // Herraje Kit

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}