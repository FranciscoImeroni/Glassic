import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoordenadasPlantilla } from './entities/coordenadas-plantilla.entity';
import { CreateCoordenadasPlantillaDto } from './dto/create-coordenadas-plantilla.dto';
import { UpdateCoordenadasPlantillaDto } from './dto/update-coordenadas-plantilla.dto';
import { BatchCoordenadasPlantillaDto } from './dto/batch-coordenadas-plantilla.dto';

@Injectable()
export class CoordenadasPlantillaService {
  constructor(
    @InjectRepository(CoordenadasPlantilla)
    private coordenadasPlantillaRepository: Repository<CoordenadasPlantilla>,
  ) {}

  async create(createDto: CreateCoordenadasPlantillaDto): Promise<CoordenadasPlantilla> {
    const coordenada = this.coordenadasPlantillaRepository.create(createDto);
    return await this.coordenadasPlantillaRepository.save(coordenada);
  }

  async findAll(): Promise<CoordenadasPlantilla[]> {
    return await this.coordenadasPlantillaRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CoordenadasPlantilla> {
    const coordenada = await this.coordenadasPlantillaRepository.findOne({
      where: { id },
    });
    if (!coordenada) {
      throw new NotFoundException(`Coordenada de plantilla con ID ${id} no encontrada`);
    }
    return coordenada;
  }

  async findByElemento(elemento: string): Promise<CoordenadasPlantilla> {
    const coordenada = await this.coordenadasPlantillaRepository.findOne({
      where: { elemento },
    });
    if (!coordenada) {
      throw new NotFoundException(`Coordenada para elemento "${elemento}" no encontrada`);
    }
    return coordenada;
  }

  async update(id: string, updateDto: UpdateCoordenadasPlantillaDto): Promise<CoordenadasPlantilla> {
    await this.coordenadasPlantillaRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.coordenadasPlantillaRepository.delete(id);
  }

  async batchSave(batchDto: BatchCoordenadasPlantillaDto): Promise<CoordenadasPlantilla[]> {
    // Eliminar todas las coordenadas existentes
    await this.coordenadasPlantillaRepository.clear();

    // Crear las nuevas coordenadas
    const coordenadas = this.coordenadasPlantillaRepository.create(batchDto.coordenadas);
    return await this.coordenadasPlantillaRepository.save(coordenadas);
  }
}
