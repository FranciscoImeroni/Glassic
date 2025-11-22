import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordenadasPlano } from './entities/coordenadas-plano.entity';
import { CoordenadasPlantilla } from './entities/coordenadas-plantilla.entity';
import { CoordenadasPlanoService } from './coordenadas-plano.service';
import { CoordenadasPlantillaService } from './coordenadas-plantilla.service';
import { CoordenadasPlanoController } from './coordenadas-plano.controller';
import { CoordenadasPlantillaController } from './coordenadas-plantilla.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CoordenadasPlano, CoordenadasPlantilla])],
  controllers: [CoordenadasPlanoController, CoordenadasPlantillaController],
  providers: [CoordenadasPlanoService, CoordenadasPlantillaService],
  exports: [CoordenadasPlanoService, CoordenadasPlantillaService],
})
export class CoordenadasModule {}
