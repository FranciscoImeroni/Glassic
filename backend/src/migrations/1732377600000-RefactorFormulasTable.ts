import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorFormulasTable1732377600000 implements MigrationInterface {
  name = 'RefactorFormulasTable1732377600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Agregar las nuevas columnas a la tabla modelos
    await queryRunner.query(`
      ALTER TABLE modelos
      ADD COLUMN IF NOT EXISTS hpf1 TEXT,
      ADD COLUMN IF NOT EXISTS hpf2 TEXT,
      ADD COLUMN IF NOT EXISTS hpue TEXT,
      ADD COLUMN IF NOT EXISTS bpf1 TEXT,
      ADD COLUMN IF NOT EXISTS bpf2 TEXT,
      ADD COLUMN IF NOT EXISTS bpf3 TEXT,
      ADD COLUMN IF NOT EXISTS bpf4 TEXT,
      ADD COLUMN IF NOT EXISTS bpu1 TEXT,
      ADD COLUMN IF NOT EXISTS bp2 TEXT,
      ADD COLUMN IF NOT EXISTS debi TEXT,
      ADD COLUMN IF NOT EXISTS htir TEXT,
      ADD COLUMN IF NOT EXISTS ckit TEXT,
      ADD COLUMN IF NOT EXISTS hkit TEXT
    `);

    // 2. Migrar datos de formulas_calculadas a modelos
    // Si hay datos existentes, intentamos migrarlos
    const hasFormulasTable = await queryRunner.hasTable('formulas_calculadas');

    if (hasFormulasTable) {
      // Obtener todas las fórmulas y agruparlas por modelo
      const formulas = await queryRunner.query(`
        SELECT
          m.id as modelo_id,
          m.codigo as modelo_codigo,
          vc.codigo as variable_codigo,
          fc.expresion
        FROM formulas_calculadas fc
        INNER JOIN modelos m ON fc.modelo_id = m.id
        INNER JOIN variables_calculadas vc ON fc.variable_id = vc.id
        WHERE fc.activa = true
      `);

      // Agrupar por modelo
      const formulasPorModelo = formulas.reduce((acc: any, row: any) => {
        if (!acc[row.modelo_id]) {
          acc[row.modelo_id] = {
            codigo: row.modelo_codigo,
            formulas: {}
          };
        }
        acc[row.modelo_id].formulas[row.variable_codigo.toLowerCase()] = row.expresion;
        return acc;
      }, {});

      // Actualizar cada modelo con sus fórmulas
      for (const [modeloId, data] of Object.entries(formulasPorModelo) as any) {
        const formulas = data.formulas;
        const updates = [];
        const values = [];
        let paramIndex = 1;

        for (const [varCode, expresion] of Object.entries(formulas)) {
          updates.push(`${varCode} = $${paramIndex}`);
          values.push(expresion);
          paramIndex++;
        }

        if (updates.length > 0) {
          values.push(modeloId);
          await queryRunner.query(
            `UPDATE modelos SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
            values
          );
        }
      }

      // 3. Eliminar las tablas antiguas
      await queryRunner.query(`DROP TABLE IF EXISTS formulas_calculadas CASCADE`);
      await queryRunner.query(`DROP TABLE IF EXISTS variables_calculadas CASCADE`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recrear las tablas antiguas
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS variables_calculadas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        codigo VARCHAR(20) UNIQUE NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        tipo_salida VARCHAR(10) DEFAULT 'number',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS formulas_calculadas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        modelo_id UUID NOT NULL REFERENCES modelos(id) ON DELETE CASCADE,
        variable_id UUID NOT NULL REFERENCES variables_calculadas(id) ON DELETE CASCADE,
        expresion TEXT NOT NULL,
        orden INTEGER DEFAULT 0,
        activa BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(modelo_id, variable_id)
      )
    `);

    // Eliminar las nuevas columnas de modelos
    await queryRunner.query(`
      ALTER TABLE modelos
      DROP COLUMN IF EXISTS hpf1,
      DROP COLUMN IF EXISTS hpf2,
      DROP COLUMN IF EXISTS hpue,
      DROP COLUMN IF EXISTS bpf1,
      DROP COLUMN IF EXISTS bpf2,
      DROP COLUMN IF EXISTS bpf3,
      DROP COLUMN IF EXISTS bpf4,
      DROP COLUMN IF EXISTS bpu1,
      DROP COLUMN IF EXISTS bp2,
      DROP COLUMN IF EXISTS debi,
      DROP COLUMN IF EXISTS htir,
      DROP COLUMN IF EXISTS ckit,
      DROP COLUMN IF EXISTS hkit
    `);
  }
}
