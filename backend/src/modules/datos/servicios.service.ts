import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    const servicio = this.servicioRepository.create(createServicioDto);
    return await this.servicioRepository.save(servicio);
  }

  async findAll(): Promise<Servicio[]> {
    return await this.servicioRepository.find();
  }

  async findPaginated(page: number = 1, limit: number = 20): Promise<{ data: Servicio[], total: number, page: number, totalPages: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.servicioRepository.findAndCount({
      skip,
      take: limit,
      order: { nombre: 'ASC' }
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Servicio> {
    const servicio = await this.servicioRepository.findOne({ where: { id } });
    if (!servicio) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }
    return servicio;
  }

  async update(id: string, updateServicioDto: UpdateServicioDto): Promise<Servicio> {
    const servicio = await this.findOne(id);
    Object.assign(servicio, updateServicioDto);
    return await this.servicioRepository.save(servicio);
  }

  async remove(id: string): Promise<void> {
    const servicio = await this.findOne(id);
    await this.servicioRepository.remove(servicio);
  }
}
