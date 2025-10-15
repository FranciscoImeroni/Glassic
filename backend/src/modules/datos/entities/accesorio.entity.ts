import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Datos } from './datos.entity';

@Entity('accesorios')
export class Accesorio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  descripcion: string; // Ej: Brazo 90º, Barral Recto 100cm, etc.

  @OneToMany(() => Datos, (dato) => dato.accesorio)
  datos: Datos[];
}
