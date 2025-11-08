import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CodigosInstruccionService } from './codigos-instruccion.service';
import { CreateCodigoInstruccionDto } from './dto/create-codigo-instruccion.dto';
import { UpdateCodigoInstruccionDto } from './dto/update-codigo-instruccion.dto';

@Controller('codigos-instruccion')
export class CodigosInstruccionController {
  constructor(private readonly codigosInstruccionService: CodigosInstruccionService) {}

  @Post()
  create(@Body() createCodigoInstruccionDto: CreateCodigoInstruccionDto) {
    return this.codigosInstruccionService.create(createCodigoInstruccionDto);
  }

  @Get()
  findAll() {
    return this.codigosInstruccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codigosInstruccionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCodigoInstruccionDto: UpdateCodigoInstruccionDto) {
    return this.codigosInstruccionService.update(id, updateCodigoInstruccionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codigosInstruccionService.remove(id);
  }
}
