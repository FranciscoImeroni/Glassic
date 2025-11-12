import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Variable } from './entities/variable.entity';
import { CodigoInstruccion } from './entities/codigo-instruccion.entity';
import { VariablesService } from './variables.service';
import { VariablesController } from './variables.controller';
import { CodigosInstruccionService } from './codigos-instruccion.service';
import { CodigosInstruccionController } from './codigos-instruccion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Variable, CodigoInstruccion])],
  controllers: [
    ProductosController,
    VariablesController,
    CodigosInstruccionController,
  ],
  providers: [
    ProductosService,
    VariablesService,
    CodigosInstruccionService,
  ],
  exports: [ProductosService],
})
export class ProductosModule {}
