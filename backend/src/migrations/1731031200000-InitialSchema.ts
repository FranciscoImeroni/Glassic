import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1731031200000 implements MigrationInterface {
  name = 'InitialSchema1731031200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Esta migración registra el estado inicial de la base de datos.
    // Las tablas ya fueron creadas por synchronize: true en deploys anteriores.
    // Por lo tanto, esta migración no hace nada en producción (Railway).
    // Solo sirve como punto de partida para futuras migraciones.

    // Si estás iniciando una base de datos desde cero, ejecuta:
    // npm run typeorm migration:run
    // Y luego las tablas se crearán automáticamente con autoLoadEntities + synchronize en desarrollo.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No revertir nada ya que no creamos nada
  }
}
