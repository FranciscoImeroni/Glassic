import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comprobante } from './entities/comprobante.entity';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';

@Injectable()
export class ComprobantesService {
  constructor(
    @InjectRepository(Comprobante)
    private readonly comprobanteRepository: Repository<Comprobante>,
  ) {}

  async create(createComprobanteDto: CreateComprobanteDto): Promise<Comprobante> {
    const comprobante = this.comprobanteRepository.create(createComprobanteDto);
    return await this.comprobanteRepository.save(comprobante);
  }

  async findAll(): Promise<Comprobante[]> {
    return await this.comprobanteRepository.find();
  }

  async findPaginated(page: number = 1, limit: number = 20): Promise<{ data: Comprobante[], total: number, page: number, totalPages: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.comprobanteRepository.findAndCount({
      skip,
      take: limit,
      order: { codigo: 'ASC' }
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Comprobante> {
    const comprobante = await this.comprobanteRepository.findOne({ where: { id } });
    if (!comprobante) {
      throw new NotFoundException(`Comprobante con ID ${id} no encontrado`);
    }
    return comprobante;
  }

  async update(id: string, updateComprobanteDto: UpdateComprobanteDto): Promise<Comprobante> {
    const comprobante = await this.findOne(id);
    Object.assign(comprobante, updateComprobanteDto);
    return await this.comprobanteRepository.save(comprobante);
  }

  async remove(id: string): Promise<void> {
    const comprobante = await this.findOne(id);
    await this.comprobanteRepository.remove(comprobante);
  }
}
