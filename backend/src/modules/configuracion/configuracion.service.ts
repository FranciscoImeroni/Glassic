import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValoresFijos } from './entities/configuracion.entity';
import { Kits } from './entities/kits.entity';
import { CreateValorFijoDto } from './dto/create-configuracion.dto';
import { UpdateValorFijoDto } from './dto/update-configuracion.dto';
import { CreateKitDto } from './dto/create-kit.dto';
import { UpdateKitDto } from './dto/update-kit.dto';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(ValoresFijos)
    private valoresFijosRepository: Repository<ValoresFijos>,
    @InjectRepository(Kits)
    private kitsRepository: Repository<Kits>,
  ) {}

  // VALORES FIJOS
  async createValorFijo(createValorFijoDto: CreateValorFijoDto): Promise<ValoresFijos> {
    const valorFijo = this.valoresFijosRepository.create(createValorFijoDto);
    return await this.valoresFijosRepository.save(valorFijo);
  }

  async findAllValoresFijos(): Promise<ValoresFijos[]> {
    return await this.valoresFijosRepository.find();
  }

  async findOneValorFijo(id: number): Promise<ValoresFijos> {
    const valorFijo = await this.valoresFijosRepository.findOne({ where: { id } });
    if (!valorFijo) {
      throw new NotFoundException(`Valor fijo con ID ${id} no encontrado`);
    }
    return valorFijo;
  }

  async updateValorFijo(id: number, updateValorFijoDto: UpdateValorFijoDto): Promise<ValoresFijos> {
    await this.valoresFijosRepository.update(id, updateValorFijoDto);
    return this.findOneValorFijo(id);
  }

  async removeValorFijo(id: number): Promise<void> {
    await this.valoresFijosRepository.delete(id);
  }

  // KITS
  async createKit(createKitDto: CreateKitDto): Promise<Kits> {
    const kit = this.kitsRepository.create(createKitDto);
    return await this.kitsRepository.save(kit);
  }

  async findAllKits(): Promise<Kits[]> {
    return await this.kitsRepository.find();
  }

  async findOneKit(id: number): Promise<Kits> {
    const kit = await this.kitsRepository.findOne({ where: { id } });
    if (!kit) {
      throw new NotFoundException(`Kit con ID ${id} no encontrado`);
    }
    return kit;
  }

  async updateKit(id: number, updateKitDto: UpdateKitDto): Promise<Kits> {
    await this.kitsRepository.update(id, updateKitDto);
    return this.findOneKit(id);
  }

  async removeKit(id: number): Promise<void> {
    await this.kitsRepository.delete(id);
  }
}
