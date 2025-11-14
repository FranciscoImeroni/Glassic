import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vidrio } from './entities/vidrio.entity';
import { CreateVidrioDto } from './dto/create-vidrio.dto';
import { UpdateVidrioDto } from './dto/update-vidrio.dto';

@Injectable()
export class VidriosService {
  constructor(
    @InjectRepository(Vidrio)
    private readonly vidrioRepository: Repository<Vidrio>,
  ) {}

  async create(createVidrioDto: CreateVidrioDto): Promise<Vidrio> {
    const vidrio = this.vidrioRepository.create(createVidrioDto);
    return await this.vidrioRepository.save(vidrio);
  }

  async findAll(): Promise<Vidrio[]> {
    return await this.vidrioRepository.find();
  }

  async findPaginated(page: number = 1, limit: number = 20): Promise<{ data: Vidrio[], total: number, page: number, totalPages: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.vidrioRepository.findAndCount({
      skip,
      take: limit,
      order: { tipo: 'ASC', color: 'ASC' }
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Vidrio> {
    const vidrio = await this.vidrioRepository.findOne({ where: { id } });
    if (!vidrio) {
      throw new NotFoundException(`Vidrio con ID ${id} no encontrado`);
    }
    return vidrio;
  }

  async update(id: string, updateVidrioDto: UpdateVidrioDto): Promise<Vidrio> {
    const vidrio = await this.findOne(id);
    Object.assign(vidrio, updateVidrioDto);
    return await this.vidrioRepository.save(vidrio);
  }

  async remove(id: string): Promise<void> {
    const vidrio = await this.findOne(id);
    await this.vidrioRepository.remove(vidrio);
  }
}
