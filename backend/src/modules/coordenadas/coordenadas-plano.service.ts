import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoordenadasPlano } from './entities/coordenadas-plano.entity';
import { CreateCoordenadasPlanoDto } from './dto/create-coordenadas-plano.dto';
import { UpdateCoordenadasPlanoDto } from './dto/update-coordenadas-plano.dto';
import { BatchCoordenadasPlanoDto } from './dto/batch-coordenadas-plano.dto';

@Injectable()
export class CoordenadasPlanoService {
  constructor(
    @InjectRepository(CoordenadasPlano)
    private coordenadasPlanoRepository: Repository<CoordenadasPlano>,
  ) {}

  async create(createDto: CreateCoordenadasPlanoDto): Promise<CoordenadasPlano> {
    const coordenada = this.coordenadasPlanoRepository.create(createDto);
    return await this.coordenadasPlanoRepository.save(coordenada);
  }

  async findAll(): Promise<CoordenadasPlano[]> {
    return await this.coordenadasPlanoRepository.find({
      relations: ['modelo', 'variable'],
    });
  }

  async findByModelo(modeloId: string): Promise<CoordenadasPlano[]> {
    return await this.coordenadasPlanoRepository.find({
      where: { modeloId },
      relations: ['modelo', 'variable'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CoordenadasPlano> {
    const coordenada = await this.coordenadasPlanoRepository.findOne({
      where: { id },
      relations: ['modelo', 'variable'],
    });
    if (!coordenada) {
      throw new NotFoundException(`Coordenada de plano con ID ${id} no encontrada`);
    }
    return coordenada;
  }

  async update(id: string, updateDto: UpdateCoordenadasPlanoDto): Promise<CoordenadasPlano> {
    await this.coordenadasPlanoRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.coordenadasPlanoRepository.delete(id);
  }

  async batchSave(batchDto: BatchCoordenadasPlanoDto): Promise<CoordenadasPlano[]> {
    // Eliminar coordenadas existentes del modelo
    await this.coordenadasPlanoRepository.delete({ modeloId: batchDto.modeloId });

    // Crear las nuevas coordenadas
    const coordenadas = this.coordenadasPlanoRepository.create(batchDto.coordenadas);
    return await this.coordenadasPlanoRepository.save(coordenadas);
  }
}
