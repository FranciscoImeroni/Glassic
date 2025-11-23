import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modelo } from './entities/modelo.entity';
import { CreateModeloDto } from './dto/create-modelo.dto';
import { UpdateModeloDto } from './dto/update-modelo.dto';
import { CalcularFormulasDto } from './dto/calcular-formulas.dto';
const FormulaParser = require('hot-formula-parser').Parser;

@Injectable()
export class FormulasService {
  constructor(
    @InjectRepository(Modelo)
    private modelosRepository: Repository<Modelo>,
  ) {}

  // MODELOS
  async createModelo(createModeloDto: CreateModeloDto): Promise<Modelo> {
    const modelo = this.modelosRepository.create(createModeloDto);
    return await this.modelosRepository.save(modelo);
  }

  async findAllModelos(): Promise<Modelo[]> {
    return await this.modelosRepository.find();
  }

  async findOneModelo(id: string): Promise<Modelo> {
    const modelo = await this.modelosRepository.findOne({
      where: { id },
    });
    if (!modelo) {
      throw new NotFoundException(`Modelo con ID ${id} no encontrado`);
    }
    return modelo;
  }

  async updateModelo(id: string, updateModeloDto: UpdateModeloDto): Promise<Modelo> {
    await this.modelosRepository.update(id, updateModeloDto);
    return this.findOneModelo(id);
  }

  async removeModelo(id: string): Promise<void> {
    await this.modelosRepository.delete(id);
  }

  // CALCULAR FORMULAS
  async calcularFormulas(calcularDto: CalcularFormulasDto): Promise<{ valoresCalculados: Record<string, number | string> }> {
    const { modeloId, valoresEntrada } = calcularDto;

    // Obtener el modelo
    const modelo = await this.findOneModelo(modeloId);

    // Crear parser de hot-formula-parser
    const parser = new FormulaParser();

    // Inicializar contexto con valores de entrada
    const contexto: Record<string, number | string> = { ...valoresEntrada };

    // Configurar variables en el parser
    for (const [key, value] of Object.entries(contexto)) {
      parser.setVariable(key, value);
    }

    // Definir las fórmulas en orden
    const formulas = [
      { codigo: 'HPF1', expresion: modelo.hpf1 },
      { codigo: 'HPF2', expresion: modelo.hpf2 },
      { codigo: 'HPUE', expresion: modelo.hpue },
      { codigo: 'BPF1', expresion: modelo.bpf1 },
      { codigo: 'BPF2', expresion: modelo.bpf2 },
      { codigo: 'BPF3', expresion: modelo.bpf3 },
      { codigo: 'BPF4', expresion: modelo.bpf4 },
      { codigo: 'BPU1', expresion: modelo.bpu1 },
      { codigo: 'BP2', expresion: modelo.bp2 },
      { codigo: 'DEBI', expresion: modelo.debi },
      { codigo: 'HTIR', expresion: modelo.htir },
      { codigo: 'CKIT', expresion: modelo.ckit },
      { codigo: 'HKIT', expresion: modelo.hkit },
    ];

    const valoresCalculados: Record<string, number | string> = {};

    // Procesar cada fórmula en orden
    for (const formula of formulas) {
      if (!formula.expresion) {
        continue; // Saltar si no hay fórmula definida
      }

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
            `Error al calcular fórmula para variable ${formula.codigo}: ${resultado.error}`
          );
        }

        // Guardar el resultado
        const valor = resultado.result;
        valoresCalculados[formula.codigo] = valor;
        contexto[formula.codigo] = valor;

        // Actualizar la variable en el parser para las siguientes fórmulas
        parser.setVariable(formula.codigo, valor);

      } catch (error) {
        throw new BadRequestException(
          `Error procesando fórmula para variable ${formula.codigo}: ${error.message}`
        );
      }
    }

    return { valoresCalculados };
  }
}
