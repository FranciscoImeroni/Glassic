import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datos } from './entities/dato.entity';
import { DatosService } from './datos.service';
import { DatosController } from './datos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Datos])],
  controllers: [DatosController],
  providers: [DatosService],
})
export class DatosModule {}
