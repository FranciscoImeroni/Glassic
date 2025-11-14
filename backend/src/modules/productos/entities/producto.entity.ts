import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Variable } from './variable.entity';
import { CodigoInstruccion } from './codigo-instruccion.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  linea: string;

  @Column({ type: 'varchar', length: 100 })
  serie: string;

  @Column({ type: 'varchar', length: 100 })
  modelo: string;

  @Column({ name: 'var_vi', type: 'varchar', length: 200 })
  varVi: string; // Ej: "VAN0,ALT1" - Lista de códigos de variables

  @Column({ name: 'cod_ivi', type: 'varchar', length: 200 })
  codIvi: string; // Ej: "1001.1002" - Lista de códigos de instrucción

  @Column({ name: 'esp_vidrio', type: 'int' })
  espVidrio: number;

  // 🔗 Relación con Variable
  @ManyToMany(() => Variable, (variable) => variable.productos, {
    cascade: true,
  })
  @JoinTable({
    name: 'producto_variable', // nombre de la tabla intermedia
    joinColumn: { name: 'producto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'variable_id', referencedColumnName: 'id' },
  })
  variables: Variable[];

  // 🔗 Relación con Código de Instrucción
  @ManyToMany(() => CodigoInstruccion, (codigo) => codigo.productos, {
    cascade: true,
  })
  @JoinTable({
    name: 'producto_instruccion',
    joinColumn: { name: 'producto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'instruccion_id', referencedColumnName: 'id' },
  })
  instrucciones: CodigoInstruccion[];
}
