import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Datos } from './datos.entity';

@Entity('herrajes')
export class Herraje {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  color: string; // Ej: BLANCO, PLATA, ORO, AC. MATE, NEGRO

  @OneToMany(() => Datos, (dato) => dato.herraje)
  datos: Datos[];
}
