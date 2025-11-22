import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class AddCoordenadasTables1731877200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla coordenadas_plantilla
    await queryRunner.createTable(
      new Table({
        name: 'coordenadas_plantilla',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'elemento',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'x',
            type: 'int',
          },
          {
            name: 'y',
            type: 'int',
          },
          {
            name: 'width',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'height',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'font_size',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'font_family',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'font_weight',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'color',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Crear tabla coordenadas_plano
    await queryRunner.createTable(
      new Table({
        name: 'coordenadas_plano',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'modelo_id',
            type: 'uuid',
          },
          {
            name: 'variable_id',
            type: 'uuid',
          },
          {
            name: 'x',
            type: 'int',
          },
          {
            name: 'y',
            type: 'int',
          },
          {
            name: 'font_size',
            type: 'int',
            default: 14,
          },
          {
            name: 'font_family',
            type: 'varchar',
            length: '50',
            default: "'Arial'",
          },
          {
            name: 'font_weight',
            type: 'varchar',
            length: '20',
            default: "'normal'",
          },
          {
            name: 'color',
            type: 'varchar',
            length: '20',
            default: "'#000000'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Crear índice único compuesto para coordenadas_plano (modelo_id, variable_id)
    await queryRunner.createIndex(
      'coordenadas_plano',
      new TableIndex({
        name: 'IDX_COORDENADAS_PLANO_MODELO_VARIABLE',
        columnNames: ['modelo_id', 'variable_id'],
        isUnique: true,
      }),
    );

    // Crear foreign keys
    await queryRunner.createForeignKey(
      'coordenadas_plano',
      new TableForeignKey({
        columnNames: ['modelo_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'modelos',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'coordenadas_plano',
      new TableForeignKey({
        columnNames: ['variable_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'variables_calculadas',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys primero
    const coordenadasPlanoTable = await queryRunner.getTable('coordenadas_plano');
    if (coordenadasPlanoTable) {
      const foreignKeys = coordenadasPlanoTable.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('coordenadas_plano', foreignKey);
      }
    }

    // Eliminar índice
    await queryRunner.dropIndex('coordenadas_plano', 'IDX_COORDENADAS_PLANO_MODELO_VARIABLE');

    // Eliminar tablas
    await queryRunner.dropTable('coordenadas_plano');
    await queryRunner.dropTable('coordenadas_plantilla');
  }
}
