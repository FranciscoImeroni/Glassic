import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Producto } from './producto.entity';

@Entity('codigo_instrucciones')
export class CodigoInstruccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  codigo: string; // Ej: "1001"

  @Column({ type: 'text' })
  instruccion: string; // Ej: "Ancho Std. 800mm"

  @ManyToMany(() => Producto, (producto) => producto.instrucciones)
  productos: Producto[];
}
