import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Datos } from './datos.entity';

@Entity('comprobantes')
export class Comprobante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo: string; // Ej: "NP", "OC", "A", etc.

  @Column({ type: 'varchar', length: 100, nullable: true })
  descripcion?: string; // Ej: "Nota de pedido", "Orden de compra", etc.

  @OneToMany(() => Datos, (dato) => dato.comprobante)
  datos: Datos[];
}
