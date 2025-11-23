import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FormulasService } from './formulas.service';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';
import { CalcularFormulasDto } from './dto/calcular-formulas.dto';

@Controller('formulas')
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  // MODELOS ENDPOINTS
  @Post('modelos')
  createModelo(@Body() createModeloDto: CreateModeloDto) {
    return this.formulasService.createModelo(createModeloDto);
  }

  @Get('modelos')
  findAllModelos(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page || limit) {
      const pageNum = page ? parseInt(page, 10) : 1;
      const limitNum = limit ? parseInt(limit, 10) : 20;
      return this.formulasService.findModelosPaginated(pageNum, limitNum);
    }
    return this.formulasService.findAllModelos();
  }

  @Get('modelos/:id')
  findOneModelo(@Param('id') id: string) {
    return this.formulasService.findOneModelo(id);
  }

  @Patch('modelos/:id')
  updateModelo(@Param('id') id: string, @Body() updateModeloDto: UpdateModeloDto) {
    return this.formulasService.updateModelo(id, updateModeloDto);
  }

  @Delete('modelos/:id')
  removeModelo(@Param('id') id: string) {
    return this.formulasService.removeModelo(id);
  }

  // CALCULAR FORMULAS ENDPOINT
  @Post('calcular')
  calcularFormulas(@Body() calcularDto: CalcularFormulasDto) {
    return this.formulasService.calcularFormulas(calcularDto);
  }
}
