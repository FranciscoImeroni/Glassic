import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('coordenadas_plantilla')
export class CoordenadasPlantilla {
  @PrimaryGeneratedColumn()
  id: number;

  // Identificador único del elemento en la plantilla
  @Column({ name: 'elemento', unique: true, length: 50 })
  elemento: string; // 'cliente', 'obra', 'referencia', 'comprobante_tipo', 'comprobante_numero', 'fecha', 'plano_area', 'esquema', 'vidrio_tipo', 'vidrio_color', 'vidrio_cantidad', 'servicio', 'herraje', 'accesorio_1', 'accesorio_2', 'accesorio_3', 'notas'

  // Coordenadas en píxeles (relativas a la plantilla ORDEN_DE_FABRICACION)
  @Column({ name: 'x', type: 'int' })
  x: number;

  @Column({ name: 'y', type: 'int' })
  y: number;

  // Dimensiones (para áreas e imágenes, null para texto simple)
  @Column({ name: 'width', type: 'int', nullable: true })
  width: number | null;

  @Column({ name: 'height', type: 'int', nullable: true })
  height: number | null;

  // Estilos de texto (null para áreas e imágenes)
  @Column({ name: 'font_size', type: 'int', nullable: true })
  fontSize: number | null;

  @Column({ name: 'font_family', length: 50, nullable: true })
  fontFamily: string | null;

  @Column({ name: 'font_weight', length: 20, nullable: true })
  fontWeight: string | null; // normal, bold

  @Column({ name: 'color', length: 7, nullable: true })
  color: string | null; // Hexadecimal

  @Column({ name: 'align', length: 10, nullable: true })
  align: string | null; // left, center, right

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
