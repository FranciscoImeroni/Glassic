import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CoordenadasPlanoService } from './coordenadas-plano.service';
import { CreateCoordenadasPlanoDto } from './dto/create-coordenadas-plano.dto';
import { UpdateCoordenadasPlanoDto } from './dto/update-coordenadas-plano.dto';
import { BatchCoordenadasPlanoDto } from './dto/batch-coordenadas-plano.dto';

@Controller('coordenadas-plano')
export class CoordenadasPlanoController {
  constructor(private readonly coordenadasPlanoService: CoordenadasPlanoService) {}

  @Post()
  create(@Body() createDto: CreateCoordenadasPlanoDto) {
    return this.coordenadasPlanoService.create(createDto);
  }

  @Post('batch')
  batchSave(@Body() batchDto: BatchCoordenadasPlanoDto) {
    return this.coordenadasPlanoService.batchSave(batchDto);
  }

  @Get()
  findAll(@Query('modeloId') modeloId?: string) {
    if (modeloId) {
      return this.coordenadasPlanoService.findByModelo(modeloId);
    }
    return this.coordenadasPlanoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordenadasPlanoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCoordenadasPlanoDto) {
    return this.coordenadasPlanoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordenadasPlanoService.remove(id);
  }
}
