import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormulasService } from './formulas.service';
import { CreateVariableCalculadaDto } from './dto/create-formula.dto';
import { UpdateVariableCalculadaDto } from './dto/update-formula.dto';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';
import { CreateFormulaCalculadaDto } from './dto/create-formula-calculada.dto';
import { UpdateFormulaCalculadaDto } from './dto/update-formula-calculada.dto';

@Controller('formulas')
export class FormulasController {
  constructor(private readonly formulasService: FormulasService) {}

  // VARIABLES CALCULADAS ENDPOINTS
  @Post('variables')
  createVariable(@Body() createVariableDto: CreateVariableCalculadaDto) {
    return this.formulasService.createVariable(createVariableDto);
  }

  @Get('variables')
  findAllVariables() {
    return this.formulasService.findAllVariables();
  }

  @Get('variables/:id')
  findOneVariable(@Param('id') id: string) {
    return this.formulasService.findOneVariable(+id);
  }

  @Patch('variables/:id')
  updateVariable(@Param('id') id: string, @Body() updateVariableDto: UpdateVariableCalculadaDto) {
    return this.formulasService.updateVariable(+id, updateVariableDto);
  }

  @Delete('variables/:id')
  removeVariable(@Param('id') id: string) {
    return this.formulasService.removeVariable(+id);
  }

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
    return this.formulasService.findOneModelo(+id);
  }

  @Patch('modelos/:id')
  updateModelo(@Param('id') id: string, @Body() updateModeloDto: UpdateModeloDto) {
    return this.formulasService.updateModelo(+id, updateModeloDto);
  }

  @Delete('modelos/:id')
  removeModelo(@Param('id') id: string) {
    return this.formulasService.removeModelo(+id);
  }

  // FORMULAS CALCULADAS ENDPOINTS
  @Post('calculadas')
  createFormulaCalculada(@Body() createFormulaDto: CreateFormulaCalculadaDto) {
    return this.formulasService.createFormulaCalculada(createFormulaDto);
  }

  @Get('calculadas')
  findAllFormulasCalculadas() {
    return this.formulasService.findAllFormulasCalculadas();
  }

  @Get('calculadas/:id')
  findOneFormulaCalculada(@Param('id') id: string) {
    return this.formulasService.findOneFormulaCalculada(+id);
  }

  @Get('calculadas/modelo/:modeloId')
  findFormulasByModelo(@Param('modeloId') modeloId: string) {
    return this.formulasService.findFormulasByModelo(+modeloId);
  }

  @Patch('calculadas/:id')
  updateFormulaCalculada(@Param('id') id: string, @Body() updateFormulaDto: UpdateFormulaCalculadaDto) {
    return this.formulasService.updateFormulaCalculada(+id, updateFormulaDto);
  }

  @Delete('calculadas/:id')
  removeFormulaCalculada(@Param('id') id: string) {
    return this.formulasService.removeFormulaCalculada(+id);
  }
}
