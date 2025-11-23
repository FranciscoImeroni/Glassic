import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  findAllModelos() {
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
