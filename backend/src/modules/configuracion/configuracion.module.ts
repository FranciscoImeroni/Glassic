import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionService } from './configuracion.service';
import { ConfiguracionController } from './configuracion.controller';
import { ValoresFijos } from './entities/configuracion.entity';
import { Kits } from './entities/kits.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ValoresFijos, Kits])],
  controllers: [ConfiguracionController],
  providers: [ConfiguracionService],
  exports: [ConfiguracionService],
})
export class ConfiguracionModule {}
