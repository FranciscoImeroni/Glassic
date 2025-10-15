// Clase: DatosService
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Datos } from './entities/datos.entity';
import { CreateDatoDto } from './dto/create-dato.dto';
import { UpdateDatoDto } from './dto/update-dato.dto';

@Injectable()
export class DatosService {
  constructor(@InjectRepository(Datos) private readonly datosRepo: Repository<Datos>) {}

  async create(createDatoDto: CreateDatoDto) {
    const entity = this.datosRepo.create(createDatoDto);
    return this.datosRepo.save(entity);
  }

  async findAll() {
    return this.datosRepo.find();
  }

  async findOne(id: number) {
    const dato = await this.datosRepo.findOne({ where: { id } });
    if (!dato) {
      throw new NotFoundException(`Dato #${id} no encontrado`);
    }
    return dato;
  }

  async update(id: number, updateDatoDto: UpdateDatoDto) {
    const toUpdate = await this.datosRepo.preload({ id, ...updateDatoDto });
    if (!toUpdate) {
      throw new NotFoundException(`Dato #${id} no encontrado`);
    }
    return this.datosRepo.save(toUpdate);
  }

  async remove(id: number) {
    const dato = await this.datosRepo.findOne({ where: { id } });
    if (!dato) {
      throw new NotFoundException(`Dato #${id} no encontrado`);
    }
    await this.datosRepo.remove(dato);
    return { deleted: true };
  }
}
