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
import { FormulasModule } from './modules/formulas/formulas.module';
import { ConfiguracionModule } from './modules/configuracion/configuracion.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CoordenadasModule } from './modules/coordenadas/coordenadas.module';

@Module({
  imports: [
    // 👇 Sirve los archivos estáticos del frontend
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
      exclude: ['/api*'], // Excluye todas las rutas de API
      serveRoot: '/', // Sirve el frontend en la raíz
    }),

    ConfigModule.forRoot({ isGlobal: true }),

    // 👇 Conexión a la base de datos (versión simplificada con DATABASE_URL)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        autoLoadEntities: true,
        // ⚠️ synchronize solo en desarrollo, NUNCA en producción
        synchronize: config.get('NODE_ENV') !== 'production',
        // Para producción, usar migraciones: npm run migration:run
        migrations: ['dist/migrations/*.js'],
        migrationsRun: config.get('NODE_ENV') === 'production',
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    UsersModule,
    DatosModule,
    ProductosModule,
    FormulasModule,
    ConfiguracionModule,
    CloudinaryModule,
    CoordenadasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}