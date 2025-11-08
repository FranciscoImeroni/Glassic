import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variable } from './entities/variable.entity';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';

@Injectable()
export class VariablesService {
  constructor(
    @InjectRepository(Variable)
    private readonly variableRepository: Repository<Variable>,
  ) {}

  async create(createVariableDto: CreateVariableDto): Promise<Variable> {
    const variable = this.variableRepository.create(createVariableDto);
    return await this.variableRepository.save(variable);
  }

  async findAll(): Promise<Variable[]> {
    return await this.variableRepository.find();
  }

  async findOne(id: string): Promise<Variable> {
    const variable = await this.variableRepository.findOne({ where: { id } });
    if (!variable) {
      throw new NotFoundException(`Variable con ID ${id} no encontrada`);
    }
    return variable;
  }

  async update(id: string, updateVariableDto: UpdateVariableDto): Promise<Variable> {
    const variable = await this.findOne(id);
    Object.assign(variable, updateVariableDto);
    return await this.variableRepository.save(variable);
  }

  async remove(id: string): Promise<void> {
    const variable = await this.findOne(id);
    await this.variableRepository.remove(variable);
  }
}
