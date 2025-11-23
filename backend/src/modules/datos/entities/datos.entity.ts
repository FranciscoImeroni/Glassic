import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comprobante } from './comprobante.entity';
import { Vidrio } from './vidrio.entity';
import { Servicio } from './servicio.entity';
import { Herraje } from './herraje.entity';
import { Accesorio } from './accesorio.entity';

@Entity('datos')
export class Datos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Comprobante, (comprobante) => comprobante.datos, { eager: true })
  @JoinColumn({ name: 'comprobante_id' })
  comprobante: Comprobante;

  @ManyToOne(() => Vidrio, (vidrio) => vidrio.datos, { eager: true })
  @JoinColumn({ name: 'vidrio_id' })
  vidrio: Vidrio;

  @ManyToOne(() => Servicio, (servicio) => servicio.datos, { eager: true })
  @JoinColumn({ name: 'servicio_id' })
  servicio: Servicio;

  @ManyToOne(() => Herraje, (herraje) => herraje.datos, { eager: true })
  @JoinColumn({ name: 'herraje_id' })
  herraje: Herraje;

  @ManyToOne(() => Accesorio, (accesorio) => accesorio.datos, { eager: true })
  @JoinColumn({ name: 'accesorio_id' })
  accesorio: Accesorio;
}
