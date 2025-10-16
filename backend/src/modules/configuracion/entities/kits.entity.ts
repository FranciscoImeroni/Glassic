import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('kits')
export class Kits {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo', unique: true, length: 20 })
  codigo: string;

  @Column({ name: 'serie_mampara', length: 100 })
  serieMampara: string;

  @Column({ name: 'nombre_kit', length: 255 })
  nombreKit: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}