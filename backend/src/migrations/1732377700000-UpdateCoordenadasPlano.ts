import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCoordenadasPlano1732377700000 implements MigrationInterface {
  name = 'UpdateCoordenadasPlano1732377700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar la nueva columna variable_codigo
    await queryRunner.query(`
      ALTER TABLE coordenadas_plano
      ADD COLUMN IF NOT EXISTS variable_codigo VARCHAR(20)
    `);

    // Migrar datos de variable_id a variable_codigo
    const hasVariableId = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'coordenadas_plano'
      AND column_name = 'variable_id'
    `);

    if (hasVariableId.length > 0) {
      // Copiar el código de la variable desde la tabla variables_calculadas
      await queryRunner.query(`
        UPDATE coordenadas_plano cp
        SET variable_codigo = vc.codigo
        FROM variables_calculadas vc
        WHERE cp.variable_id = vc.id
      `);

      // Eliminar la foreign key constraint si existe
      await queryRunner.query(`
        ALTER TABLE coordenadas_plano
        DROP CONSTRAINT IF EXISTS FK_coordenadas_plano_variable_id
      `);

      // Eliminar la columna variable_id
      await queryRunner.query(`
        ALTER TABLE coordenadas_plano
        DROP COLUMN IF EXISTS variable_id
      `);
    }

    // Eliminar el índice antiguo si existe
    await queryRunner.query(`
      DROP INDEX IF EXISTS IDX_coordenadas_plano_modelo_variable
    `);

    // Crear nuevo índice único
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS IDX_coordenadas_plano_modelo_variable_codigo
      ON coordenadas_plano(modelo_id, variable_codigo)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recrear la estructura antigua
    await queryRunner.query(`
      ALTER TABLE coordenadas_plano
      ADD COLUMN IF NOT EXISTS variable_id UUID
    `);

    // Eliminar el índice nuevo
    await queryRunner.query(`
      DROP INDEX IF EXISTS IDX_coordenadas_plano_modelo_variable_codigo
    `);

    // Recrear el índice antiguo
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS IDX_coordenadas_plano_modelo_variable
      ON coordenadas_plano(modelo_id, variable_id)
    `);

    // Agregar la foreign key constraint
    await queryRunner.query(`
      ALTER TABLE coordenadas_plano
      ADD CONSTRAINT FK_coordenadas_plano_variable_id
      FOREIGN KEY (variable_id) REFERENCES variables_calculadas(id) ON DELETE CASCADE
    `);

    // Eliminar la columna variable_codigo
    await queryRunner.query(`
      ALTER TABLE coordenadas_plano
      DROP COLUMN IF EXISTS variable_codigo
    `);
  }
}
