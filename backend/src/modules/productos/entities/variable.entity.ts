import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('variables')
export class Variable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo: string; // Ej: "VAN0"

  @Column({ type: 'varchar', length: 100 })
  nombre: string; // Ej: "Vano"

  @ManyToMany(() => Producto, (producto) => producto.variables)
  productos: Producto[];
}
