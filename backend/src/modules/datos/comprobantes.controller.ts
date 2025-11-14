import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ComprobantesService } from './comprobantes.service';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';

@Controller('comprobantes')
export class ComprobantesController {
  constructor(private readonly comprobantesService: ComprobantesService) {}

  @Post()
  create(@Body() createComprobanteDto: CreateComprobanteDto) {
    return this.comprobantesService.create(createComprobanteDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page || limit) {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 20;
      return this.comprobantesService.findPaginated(pageNum, limitNum);
    }
    return this.comprobantesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comprobantesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComprobanteDto: UpdateComprobanteDto) {
    return this.comprobantesService.update(id, updateComprobanteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comprobantesService.remove(id);
  }
}
