import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Datos } from './datos.entity';

@Entity('vidrios')
export class Vidrio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  tipo: string; // Ej: TRANSPARENTE, SATEN LISO, etc.

  @Column({ nullable: true })
  color: string; // Ej: INCOLORO, BRONCE, GRIS, etc.

  @OneToMany(() => Datos, (dato) => dato.vidrio)
  datos: Datos[];
}
