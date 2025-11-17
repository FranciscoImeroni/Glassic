import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VariableCalculada } from './entities/formula.entity';
import { Modelo } from './entities/modelo.entity';
import { FormulaCalculada } from './entities/formula-calculada.entity';
import { CreateVariableCalculadaDto } from './dto/create-formula.dto';
import { UpdateVariableCalculadaDto } from './dto/update-formula.dto';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';
import { CreateFormulaCalculadaDto } from './dto/create-formula-calculada.dto';
import { UpdateFormulaCalculadaDto } from './dto/update-formula-calculada.dto';
import { CalcularFormulasDto } from './dto/calcular-formulas.dto';
const FormulaParser = require('hot-formula-parser').Parser;

@Injectable()
export class FormulasService {
  constructor(
    @InjectRepository(VariableCalculada)
    private variablesRepository: Repository<VariableCalculada>,
    @InjectRepository(Modelo)
    private modelosRepository: Repository<Modelo>,
    @InjectRepository(FormulaCalculada)
    private formulasCalculadasRepository: Repository<FormulaCalculada>,
  ) {}

  // VARIABLES CALCULADAS
  async createVariable(createVariableDto: CreateVariableCalculadaDto): Promise<VariableCalculada> {
    const variable = this.variablesRepository.create(createVariableDto);
    return await this.variablesRepository.save(variable);
  }

  async findAllVariables(): Promise<VariableCalculada[]> {
    return await this.variablesRepository.find({
      relations: ['formulas'],
    });
  }

  async findOneVariable(id: number): Promise<VariableCalculada> {
    const variable = await this.variablesRepository.findOne({
      where: { id },
      relations: ['formulas'],
    });
    if (!variable) {
      throw new NotFoundException(`Variable calculada con ID ${id} no encontrada`);
    }
    return variable;
  }

  async updateVariable(id: number, updateVariableDto: UpdateVariableCalculadaDto): Promise<VariableCalculada> {
    await this.variablesRepository.update(id, updateVariableDto);
    return this.findOneVariable(id);
  }

  async removeVariable(id: number): Promise<void> {
    await this.variablesRepository.delete(id);
  }

  // MODELOS
  async createModelo(createModeloDto: CreateModeloDto): Promise<Modelo> {
    const modelo = this.modelosRepository.create(createModeloDto);
    return await this.modelosRepository.save(modelo);
  }

  async findAllModelos(): Promise<Modelo[]> {
    return await this.modelosRepository.find({
      relations: ['formulas'],
    });
  }

  async findOneModelo(id: number): Promise<Modelo> {
    const modelo = await this.modelosRepository.findOne({
      where: { id },
      relations: ['formulas'],
    });
    if (!modelo) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }
    return modelo;
  }

  async updateModelo(id: number, updateModeloDto: UpdateModeloDto): Promise<Modelo> {
    await this.modelosRepository.update(id, updateModeloDto);
    return this.findOneModelo(id);
  }

  async removeModelo(id: number): Promise<void> {
    await this.modelosRepository.delete(id);
  }

  // FORMULAS CALCULADAS
  async createFormulaCalculada(createFormulaDto: CreateFormulaCalculadaDto): Promise<FormulaCalculada> {
    const formula = this.formulasCalculadasRepository.create(createFormulaDto);
    return await this.formulasCalculadasRepository.save(formula);
  }

  async findAllFormulasCalculadas(): Promise<FormulaCalculada[]> {
    return await this.formulasCalculadasRepository.find({
      relations: ['modelo', 'variable'],
    });
  }

  async findOneFormulaCalculada(id: number): Promise<FormulaCalculada> {
    const formula = await this.formulasCalculadasRepository.findOne({
      where: { id },
      relations: ['modelo', 'variable'],
    });
    if (!formula) {
      throw new NotFoundException(`Fórmula calculada con ID ${id} no encontrada`);
    }
    return formula;
  }

  async findFormulasByModelo(modeloId: number): Promise<FormulaCalculada[]> {
    return await this.formulasCalculadasRepository.find({
      where: { modeloId, activa: true },
      relations: ['variable'],
      order: { orden: 'ASC' },
    });
  }

  async updateFormulaCalculada(id: number, updateFormulaDto: UpdateFormulaCalculadaDto): Promise<FormulaCalculada> {
    await this.formulasCalculadasRepository.update(id, updateFormulaDto);
    return this.findOneFormulaCalculada(id);
  }

  async removeFormulaCalculada(id: number): Promise<void> {
    await this.formulasCalculadasRepository.delete(id);
  }

  // CALCULAR FORMULAS
  async calcularFormulas(calcularDto: CalcularFormulasDto): Promise<{ valoresCalculados: Record<string, number | string> }> {
    const { modeloId, valoresEntrada } = calcularDto;

    // Obtener las fórmulas del modelo ordenadas por orden
    const formulas = await this.findFormulasByModelo(modeloId);

    if (formulas.length === 0) {
      return { valoresCalculados: {} };
    }

    // Crear parser de hot-formula-parser
    const parser = new FormulaParser();

    // Inicializar contexto con valores de entrada
    const contexto: Record<string, number | string> = { ...valoresEntrada };

    // Configurar variables en el parser
    for (const [key, value] of Object.entries(contexto)) {
      parser.setVariable(key, value);
    }

    // Procesar cada fórmula en orden
    for (const formula of formulas) {
      try {
        // Convertir la expresión de sintaxis Excel española (;) a inglesa (,)
        let expresion = formula.expresion.replace(/;/g, ',');

        // Convertir funciones de español a inglés si es necesario
        // SI -> IF, Y -> AND, O -> OR
        expresion = expresion.replace(/\bSI\(/g, 'IF(');
        expresion = expresion.replace(/\bY\(/g, 'AND(');
        expresion = expresion.replace(/\bO\(/g, 'OR(');

        // Parsear y evaluar la fórmula
        const resultado = parser.parse(expresion);

        if (resultado.error) {
          throw new BadRequestException(
            `Error al calcular fórmula para variable ${formula.variable.codigo}: ${resultado.error}`
          );
        }

        // Guardar el resultado en el contexto
        const valor = resultado.result;
        contexto[formula.variable.codigo] = valor;

        // Actualizar la variable en el parser para las siguientes fórmulas
        parser.setVariable(formula.variable.codigo, valor);

      } catch (error) {
        throw new BadRequestException(
          `Error procesando fórmula para variable ${formula.variable.codigo}: ${error.message}`
        );
      }
    }

    // Filtrar solo los valores calculados (quitar los de entrada)
    const valoresCalculados: Record<string, number | string> = {};
    for (const formula of formulas) {
      const codigo = formula.variable.codigo;
      if (codigo in contexto) {
        valoresCalculados[codigo] = contexto[codigo];
      }
    }

    return { valoresCalculados };
  }
}
