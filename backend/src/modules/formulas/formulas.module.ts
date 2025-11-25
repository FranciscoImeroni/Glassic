import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormulasService } from './formulas.service';
import { FormulasController } from './formulas.controller';
import { Modelo } from './entities/modelo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Modelo])],
  controllers: [FormulasController],
  providers: [FormulasService],
  exports: [FormulasService],
})
export class FormulasModule {}
