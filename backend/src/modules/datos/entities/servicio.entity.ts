import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Datos } from './datos.entity';

@Entity('servicios')
export class Servicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string; // Ej: COLOCADO, ENTREGADO, RETIRA CLIENTE, EMBALADO

  @OneToMany(() => Datos, (dato) => dato.servicio)
  datos: Datos[];
}
