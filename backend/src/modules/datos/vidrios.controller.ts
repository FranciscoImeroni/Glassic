import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VidriosService } from './vidrios.service';
import { CreateVidrioDto } from './dto/create-vidrio.dto';
import { UpdateVidrioDto } from './dto/update-vidrio.dto';

@Controller('vidrios')
export class VidriosController {
  constructor(private readonly vidriosService: VidriosService) {}

  @Post()
  create(@Body() createVidrioDto: CreateVidrioDto) {
    return this.vidriosService.create(createVidrioDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page || limit) {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 20;
      return this.vidriosService.findPaginated(pageNum, limitNum);
    }
    return this.vidriosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vidriosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVidrioDto: UpdateVidrioDto) {
    return this.vidriosService.update(id, updateVidrioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vidriosService.remove(id);
  }
}
