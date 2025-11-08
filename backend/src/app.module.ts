import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatosModule } from './modules/datos/datos.module';
import { ProductosModule } from './modules/productos/productos.module';

@Module({
  imports: [
    // 👇 Sirve los archivos estáticos del frontend
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'), // o 'out' si es Next export
    }),

    ConfigModule.forRoot({ isGlobal: true }),

    // 👇 Conexión a la base de datos (versión simplificada con DATABASE_URL)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');

        if (url) {
          const parsed = new URL(url);
          return {
            type: 'postgres',
            host: parsed.hostname,
            port: parseInt(parsed.port || '5432', 10),
            username: decodeURIComponent(parsed.username),
            password: decodeURIComponent(parsed.password),
            database: parsed.pathname.replace(/^\//, ''),
            autoLoadEntities: true,
            synchronize: true, // ⚠️ solo desarrollo
            ssl: { rejectUnauthorized: false },
          };
        }

        return {
          type: 'postgres',
          host: config.get<string>('PGHOST'),
          port: parseInt(config.get<string>('PGPORT') ?? '5432', 10),
          username: config.get<string>('PGUSER'),
          password: config.get<string>('PGPASSWORD'),
          database: config.get<string>('PGDATABASE'),
          autoLoadEntities: true,
          synchronize: true, // ⚠️ solo desarrollo
          ssl: { rejectUnauthorized: false },
        };
      },
    }),

    UsersModule,
    DatosModule,
    ProductosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}