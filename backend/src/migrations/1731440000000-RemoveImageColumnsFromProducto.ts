import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveImageColumnsFromProducto1731440000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Eliminar columnas viejas (si existen)
    const table = await queryRunner.getTable('productos');

    if (table?.findColumnByName('imagen')) {
      await queryRunner.dropColumn('productos', 'imagen');
    }

    if (table?.findColumnByName('esquema')) {
      await queryRunner.dropColumn('productos', 'esquema');
    }

    if (table?.findColumnByName('plano')) {
      await queryRunner.dropColumn('productos', 'plano');
    }

    // Eliminar columnas de Cloudinary (si existen)
    if (table?.findColumnByName('imagen_cloudinary_id')) {
      await queryRunner.dropColumn('productos', 'imagen_cloudinary_id');
    }

    if (table?.findColumnByName('esquema_cloudinary_id')) {
      await queryRunner.dropColumn('productos', 'esquema_cloudinary_id');
    }

    if (table?.findColumnByName('plano_cloudinary_id')) {
      await queryRunner.dropColumn('productos', 'plano_cloudinary_id');
    }

    if (table?.findColumnByName('datos_completos')) {
      await queryRunner.dropColumn('productos', 'datos_completos');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No restauramos las columnas porque ya no las necesitamos
    // Si es necesario, se pueden restaurar manualmente desde un backup
  }
}
