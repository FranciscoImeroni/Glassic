import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Variable } from './entities/variable.entity';
import { CodigoInstruccion } from './entities/codigo-instruccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Variable, CodigoInstruccion])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
