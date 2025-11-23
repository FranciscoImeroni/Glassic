// Clase: DatosService
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Datos } from './entities/datos.entity';
import { Comprobante } from './entities/comprobante.entity';
import { Vidrio } from './entities/vidrio.entity';
import { Servicio } from './entities/servicio.entity';
import { Herraje } from './entities/herraje.entity';
import { Accesorio } from './entities/accesorio.entity';
import { CreateDatoDto } from './dto/create-dato.dto';
import { UpdateDatoDto } from './dto/update-dato.dto';

@Injectable()
export class DatosService {
  constructor(
    @InjectRepository(Datos) private readonly datosRepo: Repository<Datos>,
    @InjectRepository(Comprobante) private readonly comprobanteRepo: Repository<Comprobante>,
    @InjectRepository(Vidrio) private readonly vidrioRepo: Repository<Vidrio>,
    @InjectRepository(Servicio) private readonly servicioRepo: Repository<Servicio>,
    @InjectRepository(Herraje) private readonly herrajeRepo: Repository<Herraje>,
    @InjectRepository(Accesorio) private readonly accesorioRepo: Repository<Accesorio>,
  ) {}

  async create(createDatoDto: CreateDatoDto) {
    const entityData: Partial<Datos> = {};

    // Buscar entidades relacionadas
    if (createDatoDto.comprobante) {
      const comprobante = await this.comprobanteRepo.findOne({ 
        where: { codigo: createDatoDto.comprobante } 
      });
      if (comprobante) entityData.comprobante = comprobante;
    }

    if (createDatoDto.vidrioTipo || createDatoDto.vidrioColor) {
      const vidrio = await this.vidrioRepo.findOne({ 
        where: { 
          ...(createDatoDto.vidrioTipo && { tipo: createDatoDto.vidrioTipo }),
          ...(createDatoDto.vidrioColor && { color: createDatoDto.vidrioColor })
        } 
      });
      if (vidrio) entityData.vidrio = vidrio;
    }

    if (createDatoDto.servicio) {
      const servicio = await this.servicioRepo.findOne({ 
        where: { nombre: createDatoDto.servicio } 
      });
      if (servicio) entityData.servicio = servicio;
    }

    if (createDatoDto.herrajeColor) {
      const herraje = await this.herrajeRepo.findOne({ 
        where: { color: createDatoDto.herrajeColor } 
      });
      if (herraje) entityData.herraje = herraje;
    }

    if (createDatoDto.accesorioDescripcion) {
      const accesorio = await this.accesorioRepo.findOne({ 
        where: { descripcion: createDatoDto.accesorioDescripcion } 
      });
      if (accesorio) entityData.accesorio = accesorio;
    }

    const entity = this.datosRepo.create(entityData);
    return this.datosRepo.save(entity);
  }

  async findAll() {
    return this.datosRepo.find();
  }

  async findOne(id: string) {
    const dato = await this.datosRepo.findOne({ where: { id } });
    if (!dato) {
      throw new NotFoundException(`Dato #${id} no encontrado`);
    }
    return dato;
  }

  async update(id: string, updateDatoDto: UpdateDatoDto) {
    const existing = await this.datosRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Dato #${id} no encontrado`);
    }

    const entityData: Partial<Datos> = { id };

    // Buscar entidades relacionadas
    if (updateDatoDto.comprobante) {
      const comprobante = await this.comprobanteRepo.findOne({ 
        where: { codigo: updateDatoDto.comprobante } 
      });
      if (comprobante) entityData.comprobante = comprobante;
    }

    if (updateDatoDto.vidrioTipo || updateDatoDto.vidrioColor) {
      const vidrio = await this.vidrioRepo.findOne({ 
        where: { 
          ...(updateDatoDto.vidrioTipo && { tipo: updateDatoDto.vidrioTipo }),
          ...(updateDatoDto.vidrioColor && { color: updateDatoDto.vidrioColor })
        } 
      });
      if (vidrio) entityData.vidrio = vidrio;
    }

    if (updateDatoDto.servicio) {
      const servicio = await this.servicioRepo.findOne({ 
        where: { nombre: updateDatoDto.servicio } 
      });
      if (servicio) entityData.servicio = servicio;
    }

    if (updateDatoDto.herrajeColor) {
      const herraje = await this.herrajeRepo.findOne({ 
        where: { color: updateDatoDto.herrajeColor } 
      });
      if (herraje) entityData.herraje = herraje;
    }

    if (updateDatoDto.accesorioDescripcion) {
      const accesorio = await this.accesorioRepo.findOne({ 
        where: { descripcion: updateDatoDto.accesorioDescripcion } 
      });
      if (accesorio) entityData.accesorio = accesorio;
    }

    const toUpdate = await this.datosRepo.preload(entityData);
    if (!toUpdate) {
      throw new NotFoundException(`Dato #${id} no encontrado`);
    }
    return this.datosRepo.save(toUpdate);
  }

  async remove(id: string) {
    const dato = await this.datosRepo.findOne({ where: { id } });
    if (!dato) {
      throw new NotFoundException(`Dato #${id} no encontrado`);
    }
    await this.datosRepo.remove(dato);
    return { deleted: true };
  }
}
