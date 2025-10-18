import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormulasService } from './formulas.service';
import { FormulasController } from './formulas.controller';
import { VariableCalculada } from './entities/formula.entity';
import { Modelo } from './entities/modelo.entity';
import { FormulaCalculada } from './entities/formula-calculada.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VariableCalculada, Modelo, FormulaCalculada])],
  controllers: [FormulasController],
  providers: [FormulasService],
  exports: [FormulasService],
})
export class FormulasModule {}
