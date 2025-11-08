import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodigoInstruccion } from './entities/codigo-instruccion.entity';
import { CreateCodigoInstruccionDto } from './dto/create-codigo-instruccion.dto';
import { UpdateCodigoInstruccionDto } from './dto/update-codigo-instruccion.dto';

@Injectable()
export class CodigosInstruccionService {
  constructor(
    @InjectRepository(CodigoInstruccion)
    private readonly codigoInstruccionRepository: Repository<CodigoInstruccion>,
  ) {}

  async create(createCodigoInstruccionDto: CreateCodigoInstruccionDto): Promise<CodigoInstruccion> {
    const codigo = this.codigoInstruccionRepository.create(createCodigoInstruccionDto);
    return await this.codigoInstruccionRepository.save(codigo);
  }

  async findAll(): Promise<CodigoInstruccion[]> {
    return await this.codigoInstruccionRepository.find();
  }

  async findOne(id: string): Promise<CodigoInstruccion> {
    const codigo = await this.codigoInstruccionRepository.findOne({ where: { id } });
    if (!codigo) {
      throw new NotFoundException(`Código de instrucción con ID ${id} no encontrado`);
    }
    return codigo;
  }

  async update(id: string, updateCodigoInstruccionDto: UpdateCodigoInstruccionDto): Promise<CodigoInstruccion> {
    const codigo = await this.findOne(id);
    Object.assign(codigo, updateCodigoInstruccionDto);
    return await this.codigoInstruccionRepository.save(codigo);
  }

  async remove(id: string): Promise<void> {
    const codigo = await this.findOne(id);
    await this.codigoInstruccionRepository.remove(codigo);
  }
}
