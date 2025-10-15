import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datos } from './entities/datos.entity';
import { Comprobante } from './entities/comprobante.entity';
import { Vidrio } from './entities/vidrio.entity';
import { Servicio } from './entities/servicio.entity';
import { Herraje } from './entities/herraje.entity';
import { Accesorio } from './entities/accesorio.entity';
import { DatosService } from './datos.service';
import { DatosController } from './datos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Datos,
    Comprobante,
    Vidrio,
    Servicio,
    Herraje,
    Accesorio
  ])],
  controllers: [DatosController],
  providers: [DatosService],
})
export class DatosModule {}
