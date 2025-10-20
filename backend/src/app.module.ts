import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatosModule } from './modules/datos/datos.module';
import { ProductosModule } from './modules/productos/productos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('PGHOST')!,
        port: parseInt(config.get('PGPORT') || '5432', 10),
        username: config.get('PGUSER')!,
        password: config.get('PGPASSWORD')!,
        database: config.get('PGDATABASE')!, 
        autoLoadEntities: true,
        synchronize: true, 
        ssl: {
        rejectUnauthorized: false 
    }
      }),
    }),
    UsersModule,
    DatosModule,
    ProductosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
