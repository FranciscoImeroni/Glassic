import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCloudinaryFieldsToProducto1731430000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columnas de Cloudinary
    await queryRunner.addColumn(
      'productos',
      new TableColumn({
        name: 'imagen_cloudinary_id',
        type: 'varchar',
        length: '200',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'productos',
      new TableColumn({
        name: 'esquema_cloudinary_id',
        type: 'varchar',
        length: '200',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'productos',
      new TableColumn({
        name: 'plano_cloudinary_id',
        type: 'varchar',
        length: '200',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'productos',
      new TableColumn({
        name: 'datos_completos',
        type: 'boolean',
        default: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('productos', 'datos_completos');
    await queryRunner.dropColumn('productos', 'plano_cloudinary_id');
    await queryRunner.dropColumn('productos', 'esquema_cloudinary_id');
    await queryRunner.dropColumn('productos', 'imagen_cloudinary_id');
  }
}
