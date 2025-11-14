import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AccesoriosService } from './accesorios.service';
import { CreateAccesorioDto } from './dto/create-accesorio.dto';
import { UpdateAccesorioDto } from './dto/update-accesorio.dto';

@Controller('accesorios')
export class AccesoriosController {
  constructor(private readonly accesoriosService: AccesoriosService) {}

  @Post()
  create(@Body() createAccesorioDto: CreateAccesorioDto) {
    return this.accesoriosService.create(createAccesorioDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page || limit) {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 20;
      return this.accesoriosService.findPaginated(pageNum, limitNum);
    }
    return this.accesoriosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accesoriosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccesorioDto: UpdateAccesorioDto) {
    return this.accesoriosService.update(id, updateAccesorioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accesoriosService.remove(id);
  }
}
