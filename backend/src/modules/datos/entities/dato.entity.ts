import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('datos')
export class Datos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  comprobante: string; // NP, OC, A, etc.

  @Column({ name: 'vidrio_tipo', nullable: true })
  vidrioTipo: string;

  @Column({ name: 'vidrio_color', nullable: true })
  vidrioColor: string;

  @Column({ nullable: true })
  servicio: string;

  @Column({ name: 'herraje_color', nullable: true })
  herrajeColor: string;

  @Column({ name: 'accesorio_descripcion', nullable: true })
  accesorioDescripcion: string;
}
