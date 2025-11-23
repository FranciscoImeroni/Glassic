import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('valores_fijos')
export class ValoresFijos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'codigo', unique: true, length: 20 })
  codigo: string;

  @Column({ name: 'descripcion', length: 255 })
  descripcion: string;

  @Column({ name: 'valor_mm', type: 'decimal', precision: 10, scale: 2 })
  valorMm: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}