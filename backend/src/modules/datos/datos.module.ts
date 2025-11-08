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
import { ComprobantesService } from './comprobantes.service';
import { ComprobantesController } from './comprobantes.controller';
import { VidriosService } from './vidrios.service';
import { VidriosController } from './vidrios.controller';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { HerrajesService } from './herrajes.service';
import { HerrajesController } from './herrajes.controller';
import { AccesoriosService } from './accesorios.service';
import { AccesoriosController } from './accesorios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    Datos,
    Comprobante,
    Vidrio,
    Servicio,
    Herraje,
    Accesorio
  ])],
  controllers: [
    DatosController,
    ComprobantesController,
    VidriosController,
    ServiciosController,
    HerrajesController,
    AccesoriosController,
  ],
  providers: [
    DatosService,
    ComprobantesService,
    VidriosService,
    ServiciosService,
    HerrajesService,
    AccesoriosService,
  ],
})
export class DatosModule {}
