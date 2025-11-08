import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Herraje } from './entities/herraje.entity';
import { CreateHerrajeDto } from './dto/create-herraje.dto';
import { UpdateHerrajeDto } from './dto/update-herraje.dto';

@Injectable()
export class HerrajesService {
  constructor(
    @InjectRepository(Herraje)
    private readonly herrajeRepository: Repository<Herraje>,
  ) {}

  async create(createHerrajeDto: CreateHerrajeDto): Promise<Herraje> {
    const herraje = this.herrajeRepository.create(createHerrajeDto);
    return await this.herrajeRepository.save(herraje);
  }

  async findAll(): Promise<Herraje[]> {
    return await this.herrajeRepository.find();
  }

  async findOne(id: string): Promise<Herraje> {
    const herraje = await this.herrajeRepository.findOne({ where: { id } });
    if (!herraje) {
      throw new NotFoundException(`Herraje con ID ${id} no encontrado`);
    }
    return herraje;
  }

  async update(id: string, updateHerrajeDto: UpdateHerrajeDto): Promise<Herraje> {
    const herraje = await this.findOne(id);
    Object.assign(herraje, updateHerrajeDto);
    return await this.herrajeRepository.save(herraje);
  }

  async remove(id: string): Promise<void> {
    const herraje = await this.findOne(id);
    await this.herrajeRepository.remove(herraje);
  }
}
