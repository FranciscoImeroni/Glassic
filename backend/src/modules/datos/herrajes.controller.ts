import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  findAll() {
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
