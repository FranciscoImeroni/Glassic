import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HerrajesService } from './herrajes.service';
import { CreateHerrajeDto } from './dto/create-herraje.dto';
import { UpdateHerrajeDto } from './dto/update-herraje.dto';

@Controller('herrajes')
export class HerrajesController {
  constructor(private readonly herrajesService: HerrajesService) {}

  @Post()
  create(@Body() createHerrajeDto: CreateHerrajeDto) {
    return this.herrajesService.create(createHerrajeDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page || limit) {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 20;
      return this.herrajesService.findPaginated(pageNum, limitNum);
    }
    return this.herrajesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.herrajesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHerrajeDto: UpdateHerrajeDto) {
    return this.herrajesService.update(id, updateHerrajeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.herrajesService.remove(id);
  }
}
