import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accesorio } from './entities/accesorio.entity';
import { CreateAccesorioDto } from './dto/create-accesorio.dto';
import { UpdateAccesorioDto } from './dto/update-accesorio.dto';

@Injectable()
export class AccesoriosService {
  constructor(
    @InjectRepository(Accesorio)
    private readonly accesorioRepository: Repository<Accesorio>,
  ) {}

  async create(createAccesorioDto: CreateAccesorioDto): Promise<Accesorio> {
    const accesorio = this.accesorioRepository.create(createAccesorioDto);
    return await this.accesorioRepository.save(accesorio);
  }

  async findAll(): Promise<Accesorio[]> {
    return await this.accesorioRepository.find();
  }

  async findOne(id: string): Promise<Accesorio> {
    const accesorio = await this.accesorioRepository.findOne({ where: { id } });
    if (!accesorio) {
      throw new NotFoundException(`Accesorio con ID ${id} no encontrado`);
    }
    return accesorio;
  }

  async update(id: string, updateAccesorioDto: UpdateAccesorioDto): Promise<Accesorio> {
    const accesorio = await this.findOne(id);
    Object.assign(accesorio, updateAccesorioDto);
    return await this.accesorioRepository.save(accesorio);
  }

  async remove(id: string): Promise<void> {
    const accesorio = await this.findOne(id);
    await this.accesorioRepository.remove(accesorio);
  }
}
