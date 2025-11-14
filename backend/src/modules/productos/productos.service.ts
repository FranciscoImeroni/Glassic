import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Variable } from './entities/variable.entity';
import { CodigoInstruccion } from './entities/codigo-instruccion.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Variable)
    private readonly variableRepository: Repository<Variable>,
    @InjectRepository(CodigoInstruccion)
    private readonly codigoInstruccionRepository: Repository<CodigoInstruccion>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const { variableIds, instruccionIds, ...productoData } = createProductoDto;

    const producto = this.productoRepository.create(productoData);

    // Asignar variables si se proporcionaron IDs
    if (variableIds && variableIds.length > 0) {
      producto.variables = await this.variableRepository.findByIds(variableIds);
    }

    // Asignar instrucciones si se proporcionaron IDs
    if (instruccionIds && instruccionIds.length > 0) {
      producto.instrucciones = await this.codigoInstruccionRepository.findByIds(instruccionIds);
    }

    return await this.productoRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({
      relations: ['variables', 'instrucciones'],
    });
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['variables', 'instrucciones'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const { variableIds, instruccionIds, ...productoData } = updateProductoDto;
    const producto = await this.findOne(id);

    Object.assign(producto, productoData);

    // Actualizar variables si se proporcionaron IDs
    if (variableIds !== undefined) {
      if (variableIds.length > 0) {
        producto.variables = await this.variableRepository.findByIds(variableIds);
      } else {
        producto.variables = [];
      }
    }

    // Actualizar instrucciones si se proporcionaron IDs
    if (instruccionIds !== undefined) {
      if (instruccionIds.length > 0) {
        producto.instrucciones = await this.codigoInstruccionRepository.findByIds(instruccionIds);
      } else {
        producto.instrucciones = [];
      }
    }

    return await this.productoRepository.save(producto);
  }

  async remove(id: string): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }
}
