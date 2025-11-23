import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoordenadasPlantillaService } from './coordenadas-plantilla.service';
import { CreateCoordenadasPlantillaDto } from './dto/create-coordenadas-plantilla.dto';
import { UpdateCoordenadasPlantillaDto } from './dto/update-coordenadas-plantilla.dto';
import { BatchCoordenadasPlantillaDto } from './dto/batch-coordenadas-plantilla.dto';

@Controller('coordenadas-plantilla')
export class CoordenadasPlantillaController {
  constructor(private readonly coordenadasPlantillaService: CoordenadasPlantillaService) {}

  @Post()
  create(@Body() createDto: CreateCoordenadasPlantillaDto) {
    return this.coordenadasPlantillaService.create(createDto);
  }

  @Post('batch')
  batchSave(@Body() batchDto: BatchCoordenadasPlantillaDto) {
    return this.coordenadasPlantillaService.batchSave(batchDto);
  }

  @Get()
  findAll() {
    return this.coordenadasPlantillaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordenadasPlantillaService.findOne(id);
  }

  @Get('elemento/:elemento')
  findByElemento(@Param('elemento') elemento: string) {
    return this.coordenadasPlantillaService.findByElemento(elemento);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCoordenadasPlantillaDto) {
    return this.coordenadasPlantillaService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordenadasPlantillaService.remove(id);
  }
}
