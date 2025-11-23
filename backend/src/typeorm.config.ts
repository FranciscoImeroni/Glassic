import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: true, // SIEMPRE false cuando usas migraciones
  // SSL solo en producción (Railway, etc), no en desarrollo local
  ssl: isProduction ? {
    rejectUnauthorized: false,
  } : false,
});
