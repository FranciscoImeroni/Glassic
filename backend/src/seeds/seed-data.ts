import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Variable } from '../modules/productos/entities/variable.entity';
import { Producto } from '../modules/productos/entities/producto.entity';
import { CodigoInstruccion } from '../modules/productos/entities/codigo-instruccion.entity';
import { Modelo } from '../modules/formulas/entities/modelo.entity';
import { VariableCalculada } from '../modules/formulas/entities/formula.entity';
import { FormulaCalculada } from '../modules/formulas/entities/formula-calculada.entity';
import { Comprobante } from '../modules/datos/entities/comprobante.entity';
import { Vidrio } from '../modules/datos/entities/vidrio.entity';
import { Herraje } from '../modules/datos/entities/herraje.entity';
import { Servicio } from '../modules/datos/entities/servicio.entity';
import { Accesorio } from '../modules/datos/entities/accesorio.entity';
import { Kits } from '../modules/configuracion/entities/kits.entity';
import { ValoresFijos } from '../modules/configuracion/entities/configuracion.entity';

config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
    ssl: (process.env.NODE_ENV === 'production') ? { rejectUnauthorized: false } : false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      console.log('\nLimpiando datos existentes...');
      const rows = await dataSource.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
      const tables = rows.map((r: any) => r.tablename).filter((t: string) => t !== 'migrations');
      if (tables.length) {
        const quoted = tables.map((t: string) => `"${t}"`).join(', ');
        await dataSource.query(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`);
      }
      console.log('Datos existentes eliminados');
      return;
    }

    // 1. COMPROBANTES
    console.log('\n📋 Creando comprobantes...');
    const comprobanteRepo = dataSource.getRepository(Comprobante);

    const comprobantes = [
      { codigo: 'NP', descripcion: 'Nota de Pedido' },
      { codigo: 'OC', descripcion: 'Orden de Compra' },
      { codigo: 'A', descripcion: 'Tipo A' },
      { codigo: 'B', descripcion: 'Tipo B' },
      { codigo: 'R', descripcion: 'Tipo R' },
      { codigo: 'X', descripcion: 'Tipo X' },
    ];

    for (const compData of comprobantes) {
      const comp = comprobanteRepo.create(compData);
      await comprobanteRepo.save(comp);
      console.log(`  ✓ Comprobante ${compData.codigo} creado`);
    }

    // 2. VIDRIOS
    console.log('\n🪟 Creando vidrios...');
    const vidrioRepo = dataSource.getRepository(Vidrio);

    const vidrios = [
      { tipo: 'TRANSPARENTE', color: 'INCOLORO' },
      { tipo: 'OPACID', color: 'BRONCE' },
      { tipo: 'SATEN LISO', color: 'GRIS' },
      { tipo: 'PACIFIC', color: 'INCOLORO' },
    ];

    for (const vidrioData of vidrios) {
      const vidrio = vidrioRepo.create(vidrioData);
      await vidrioRepo.save(vidrio);
      console.log(`  ✓ Vidrio ${vidrioData.tipo} ${vidrioData.color} creado`);
    }

    // 3. SERVICIOS
    console.log('\n🛠️  Creando servicios...');
    const servicioRepo = dataSource.getRepository(Servicio);

    const servicios = [
      { nombre: 'COLOCADO' },
      { nombre: 'ENTREGADO' },
      { nombre: 'RETIRA CLIENTE' },
      { nombre: 'EMBALADO' },
    ];

    for (const servicioData of servicios) {
      const servicio = servicioRepo.create(servicioData);
      await servicioRepo.save(servicio);
      console.log(`  ✓ Servicio "${servicioData.nombre}" creado`);
    }

    // 4. HERRAJES
    console.log('\n🔩 Creando herrajes...');
    const herrajeRepo = dataSource.getRepository(Herraje);

    const herrajes = [
      { color: 'BLANCO' },
      { color: 'PLATA' },
      { color: 'ORO' },
      { color: 'AC. MATE' },
      { color: 'NEGRO' },
    ];

    for (const herrajeData of herrajes) {
      const herraje = herrajeRepo.create(herrajeData);
      await herrajeRepo.save(herraje);
      console.log(`  ✓ Herraje ${herrajeData.color} creado`);
    }

    // 5. ACCESORIOS
    console.log('\n🔧 Creando accesorios...');
    const accesorioRepo = dataSource.getRepository(Accesorio);

    const accesorios = [
      { descripcion: 'Brazo 90º' },
      { descripcion: 'Brazo Recto  80cm' },
      { descripcion: 'Brazo Recto 100cm' },
      { descripcion: 'Brazo Recto 120cm' },
      { descripcion: 'Toallero Simple' },
      { descripcion: 'Barral Toallero' },
      { descripcion: 'Manija rebatible' },
      { descripcion: 'Tubo 30x30x2000' },
      { descripcion: 'Tubo 40x40x2000' },
      { descripcion: 'Tubo 50x50x2000' },
      { descripcion: 'Barral Recto 100cm' },
      { descripcion: 'Barral Recto 200cm' },
      { descripcion: 'Barral Recto 250cm' },
      { descripcion: 'Barral 2Lados  100x100cm' },
      { descripcion: 'Barral 2Lados  200x100cm' },
      { descripcion: 'Barral 2Lados  250x100cm' },
      { descripcion: 'Barral 3Lados  100x100cm' },
      { descripcion: 'Barral 3Lados  200x100cm' },
      { descripcion: 'Barral 3Lados  250x100cm' },
      { descripcion: 'Tambor Paralelo (anc.adic)' },
    ];

    for (const accData of accesorios) {
      const acc = accesorioRepo.create(accData);
      await accesorioRepo.save(acc);
      console.log(`  ✓ Accesorio "${accData.descripcion}" creado`);
    }

    // 6. VARIABLES DE ENTRADA (VAR-VI)
    console.log('\n📝 Creando variables de entrada...');
    const variableRepo = dataSource.getRepository(Variable);

    const variables = [
      { codigo: 'VAN0', nombre: 'Vano' },
      { codigo: 'VAN1', nombre: 'Vano 1' },
      { codigo: 'VAN2', nombre: 'Vano 2' },
      { codigo: 'VAN3', nombre: 'Vano 3' },
      { codigo: 'ALT1', nombre: 'Altura' },
      { codigo: 'ESC1', nombre: 'Escalon' },
      { codigo: 'ENT1', nombre: 'Entrante' },
      { codigo: 'HOJ1', nombre: 'Hoja' },
      { codigo: 'PAF1', nombre: 'PF 1' },
      { codigo: 'PAF2', nombre: 'PF 2' },
      { codigo: 'RAD1', nombre: 'Radio' },
    ];

    const variablesMap = new Map<string, Variable>();
    for (const varData of variables) {
      const variable = variableRepo.create(varData);
      const saved = await variableRepo.save(variable);
      variablesMap.set(varData.codigo, saved);
      console.log(`  ✓ Variable ${varData.codigo} creada`);
    }

    // 7. INSTRUCCIONES (COD-IVI)
    console.log('\n📖 Creando instrucciones...');
    const instruccionRepo = dataSource.getRepository(CodigoInstruccion);

    const instrucciones = [
      { codigo: '1001', instruccion: 'Ancho Std. 800mm' },
      { codigo: '1002', instruccion: 'Alturas Std.: 1600 y 2000 mm' },
      { codigo: '1003', instruccion: 'Altura MAXIMA: 2000 mm' },
      { codigo: '1004', instruccion: 'Ancho MINIMO: 1000 mm' },
      { codigo: '1005', instruccion: 'Ancho MINIMO: 1300 mm' },
      { codigo: '1006', instruccion: 'Ancho MINIMO: 1600 mm' },
      { codigo: '1007', instruccion: 'Ancho MINIMO: 1400 mm' },
      { codigo: '1008', instruccion: 'Medido a filo EXTERIOR del zocalo' },
      { codigo: '1009', instruccion: 'Radio Std. 150 mm' },
      { codigo: '1010', instruccion: 'Ancho VANO paño fijo CHICO' },
    ];

    const instruccionesMap = new Map<string, CodigoInstruccion>();
    for (const instData of instrucciones) {
      const instruccion = instruccionRepo.create(instData);
      const saved = await instruccionRepo.save(instruccion);
      instruccionesMap.set(instData.codigo, saved);
      console.log(`  ✓ Instrucción ${instData.codigo} creada`);
    }

    // 8. PRODUCTOS (BD VALORES INGRESADOS)
    console.log('\n📦 Creando productos...');
    const productoRepo = dataSource.getRepository(Producto);

    const productos = [
      { linea: 'Linea 1000', serie: 'Panel', modelo: '1000', varVi: 'VAN0,ALT1', codIvi: '1001,1002', espVidrio: 8 },
      { linea: 'Linea 1000', serie: 'Panel', modelo: '1010-i', varVi: 'VAN0,ALT1', codIvi: '1001,1002', espVidrio: 8 },
      { linea: 'Linea 1000', serie: 'Panel', modelo: '1010-d', varVi: 'VAN0,ALT1', codIvi: '1001,1002', espVidrio: 8 },
      { linea: 'Linea 1000', serie: 'Panel Angulo', modelo: '1200-i', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1002', espVidrio: 8 },
      { linea: 'Linea 1000', serie: 'Panel Angulo', modelo: '1200-d', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1002', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Frontal', modelo: '4000-Ai', varVi: 'VAN0,ALT1', codIvi: '1004,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Frontal', modelo: '4000-Ad', varVi: 'VAN0,ALT1', codIvi: '1004,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Frontal', modelo: '4000-Bi', varVi: 'VAN0,ALT1', codIvi: '1006,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Frontal', modelo: '4000-Bd', varVi: 'VAN0,ALT1', codIvi: '1006,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Frontal', modelo: '4000-Ci', varVi: 'VAN0,ALT1,PAF1', codIvi: '1005,1003,1010', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Frontal', modelo: '4000-Cd', varVi: 'VAN0,ALT1,PAF1', codIvi: '1005,1003,1010', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Frontal', modelo: '4000-D', varVi: 'VAN0,ALT1', codIvi: '1007,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Esquinero', modelo: '4100', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-A1i', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-A1d', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-A2i', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-A2d', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-Bi', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-Bd', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1003', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-C1i', varVi: 'VAN1,VAN2,ALT1,PAF1', codIvi: '1008,1008,1003,1010', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-C1d', varVi: 'VAN1,VAN2,ALT1,PAF1', codIvi: '1008,1008,1003,1010', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-C2i', varVi: 'VAN1,VAN2,ALT1,PAF1', codIvi: '1008,1008,1003,1010', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-C2d', varVi: 'VAN1,VAN2,ALT1,PAF1', codIvi: '1008,1008,1003,1010', espVidrio: 8 },
      { linea: 'Linea 4000', serie: 'Box Angular', modelo: '4200-D', varVi: 'VAN1,VAN2,ALT1', codIvi: '1008,1008,1003', espVidrio: 8 },
    ];

    for (const prodData of productos) {
      // Obtener las variables asociadas
      const varCodes = prodData.varVi.split(',').map(v => v.trim());
      const varsAsociadas = varCodes.map(code => variablesMap.get(code)).filter(v => v !== undefined) as Variable[];

      // Obtener las instrucciones asociadas
      const instCodes = prodData.codIvi.split(',').map(c => c.trim());
      const instsAsociadas = instCodes.map(code => instruccionesMap.get(code)).filter(i => i !== undefined) as CodigoInstruccion[];

      const producto = productoRepo.create({
        ...prodData,
        variables: varsAsociadas,
        instrucciones: instsAsociadas,
      });
      await productoRepo.save(producto);
      console.log(`  ✓ Producto ${prodData.modelo} creado`);
    }

    // 9. VALORES FIJOS (COD-VF)
    console.log('\n🔢 Creando valores fijos...');
    const valoresFijosRepo = dataSource.getRepository(ValoresFijos);

    const valoresFijos = [
      { codigo: '2001', descripcion: 'Diam. Agujero Cantonera', valorMm: 16 },
      { codigo: '2002', descripcion: 'X Cantonera vidrio tapa', valorMm: 32 },
      { codigo: '2003', descripcion: 'X Cantonera vidrio lateral', valorMm: 23 },
      { codigo: '2004', descripcion: 'Y Cantonera desde arriba', valorMm: 50 },
      { codigo: '2005', descripcion: 'Diam. Agujero Rueda Box', valorMm: 16 },
      { codigo: '2006', descripcion: 'X Rueda Box', valorMm: 85 },
      { codigo: '2007', descripcion: 'Y Rueda Box', valorMm: 20 },
      { codigo: '2008', descripcion: 'Diam. Agujero Tirador Risaro', valorMm: 10 },
      { codigo: '2009', descripcion: 'X Tirador Box Frontal', valorMm: 45 },
      { codigo: '2010', descripcion: 'X Tirador Esquinero', valorMm: 45 },
    ];

    for (const vfData of valoresFijos) {
      const vf = valoresFijosRepo.create(vfData);
      await valoresFijosRepo.save(vf);
      console.log(`  ✓ Valor Fijo ${vfData.codigo} creado`);
    }

    // 10. KITS (COD-KIT)
    console.log('\n📦 Creando kits...');
    const kitsRepo = dataSource.getRepository(Kits);

    const kits = [
      { codigo: 'PN-80', serieMampara: 'Panel', nombreKit: 'Kit PN-80' },
      { codigo: 'PA-80', serieMampara: 'Panel angulo', nombreKit: 'Kit PA-80' },
      { codigo: 'BF-160-1', serieMampara: 'Box Frontal', nombreKit: 'Kit BF-160 / 1P' },
      { codigo: 'BF-160-2', serieMampara: 'Box Frontal', nombreKit: 'Kit BF-160 / 2P' },
      { codigo: 'BF-200-1', serieMampara: 'Box Frontal', nombreKit: 'Kit BF-200 / 2P' },
      { codigo: 'BF-200-2', serieMampara: 'Box Frontal', nombreKit: 'Kit BF-200 / 1P' },
      { codigo: 'BF-250-1', serieMampara: 'Box Frontal', nombreKit: 'Kit BF-250 / 2P' },
      { codigo: 'BF-250-2', serieMampara: 'Box Frontal', nombreKit: 'Kit BF-250 / 1P' },
      { codigo: 'BE-100', serieMampara: 'Box Esquinero', nombreKit: 'Kit BE-100' },
      { codigo: 'BE-120', serieMampara: 'Box Esquinero', nombreKit: 'Kit BE-120' },
      { codigo: 'BE-150', serieMampara: 'Box Esquinero', nombreKit: 'Kit BE-150' },
      { codigo: 'BA-160', serieMampara: 'Box Angular', nombreKit: 'Kit BA-160' },
      { codigo: 'BA-200', serieMampara: 'Box Angular', nombreKit: 'Kit BA-200' },
      { codigo: 'BA-250', serieMampara: 'Box Angular', nombreKit: 'Kit BA-250' },
    ];

    for (const kitData of kits) {
      const kit = kitsRepo.create(kitData);
      await kitsRepo.save(kit);
      console.log(`  ✓ Kit ${kitData.codigo} creado`);
    }

    // 11. MODELOS (para fórmulas)
    console.log('\n🔧 Creando modelos de fórmulas...');
    const modeloRepo = dataSource.getRepository(Modelo);

    const modelos = [
      { codigo: '1000', descripcion: 'Modelo 1000' },
      { codigo: '1010-i', descripcion: 'Modelo 1010 izquierdo' },
      { codigo: '1010-d', descripcion: 'Modelo 1010 derecho' },
      { codigo: '1200-i', descripcion: 'Modelo 1200 izquierdo' },
      { codigo: '1200-d', descripcion: 'Modelo 1200 derecho' },
      { codigo: '4000-Ai', descripcion: 'Modelo 4000-Ai' },
      { codigo: '4000-Ad', descripcion: 'Modelo 4000-Ad' },
      { codigo: '4000-Bi', descripcion: 'Modelo 4000-Bi' },
      { codigo: '4000-Bd', descripcion: 'Modelo 4000-Bd' },
      { codigo: '4000-Ci', descripcion: 'Modelo 4000-Ci' },
      { codigo: '4000-Cd', descripcion: 'Modelo 4000-Cd' },
      { codigo: '4000-D', descripcion: 'Modelo 4000-D' },
      { codigo: '4100', descripcion: 'Modelo 4100' },
      { codigo: '4200-A1i', descripcion: 'Modelo 4200-A1i' },
      { codigo: '4200-A1d', descripcion: 'Modelo 4200-A1d' },
      { codigo: '4200-A2i', descripcion: 'Modelo 4200-A2i' },
      { codigo: '4200-A2d', descripcion: 'Modelo 4200-A2d' },
      { codigo: '4200-Bi', descripcion: 'Modelo 4200-Bi' },
      { codigo: '4200-Bd', descripcion: 'Modelo 4200-Bd' },
      { codigo: '4200-C1i', descripcion: 'Modelo 4200-C1i' },
      { codigo: '4200-C1d', descripcion: 'Modelo 4200-C1d' },
      { codigo: '4200-C2i', descripcion: 'Modelo 4200-C2i' },
      { codigo: '4200-C2d', descripcion: 'Modelo 4200-C2d' },
      { codigo: '4200-D', descripcion: 'Modelo 4200-D' },
    ];

    const modelosMap = new Map<string, Modelo>();
    for (const modeloData of modelos) {
      const modelo = modeloRepo.create(modeloData);
      const saved = await modeloRepo.save(modelo);
      modelosMap.set(modeloData.codigo, saved);
      console.log(`  ✓ Modelo ${modeloData.codigo} creado`);
    }

    // 12. VARIABLES CALCULADAS (VAR-VC)
    console.log('\n📊 Creando variables calculadas...');
    const varCalcRepo = dataSource.getRepository(VariableCalculada);

    const variablesCalculadas = [
      { codigo: 'HPF1', descripcion: 'Altura Paño Fijo 1', tipoSalida: 'number' as const },
      { codigo: 'HPF2', descripcion: 'Altura Paño Fijo 2', tipoSalida: 'number' as const },
      { codigo: 'HPUE', descripcion: 'Alturas Puertas', tipoSalida: 'number' as const },
      { codigo: 'BPF1', descripcion: 'Base Paño Fijo 1', tipoSalida: 'number' as const },
      { codigo: 'BPF2', descripcion: 'Base Paño Fijo 2', tipoSalida: 'number' as const },
      { codigo: 'BPF3', descripcion: 'Base Paño Fijo 3', tipoSalida: 'number' as const },
      { codigo: 'BPF4', descripcion: 'Base Paño Fijo 4', tipoSalida: 'number' as const },
      { codigo: 'BPU1', descripcion: 'Base Puerta 1', tipoSalida: 'number' as const },
      { codigo: 'BPU2', descripcion: 'Base Puerta 2', tipoSalida: 'number' as const },
      { codigo: 'DEBI', descripcion: 'Dist. entre Bisagras', tipoSalida: 'number' as const },
      { codigo: 'HTIR', descripcion: 'Altura Tirador', tipoSalida: 'number' as const },
      { codigo: 'CKIT', descripcion: 'Codigo Kit', tipoSalida: 'string' as const },
      { codigo: 'HKIT', descripcion: 'Altura Kit', tipoSalida: 'string' as const },
    ];

    const variablesCalcMap = new Map<string, VariableCalculada>();
    for (const varData of variablesCalculadas) {
      const varCalc = varCalcRepo.create(varData);
      const saved = await varCalcRepo.save(varCalc);
      variablesCalcMap.set(varData.codigo, saved);
      console.log(`  ✓ Variable calculada ${varData.codigo} creada`);
    }

    // 13. FÓRMULAS CALCULADAS
    console.log('\n🧮 Creando fórmulas...');
    const formulaRepo = dataSource.getRepository(FormulaCalculada);

    // Datos de fórmulas organizados por modelo
    const formulasData = [
      // Modelo 1000
      { modeloCodigo: '1000', varCodigo: 'HPF1', expresion: 'ALT1-7', orden: 1 },
      { modeloCodigo: '1000', varCodigo: 'BPF1', expresion: 'VAN0-7', orden: 2 },
      { modeloCodigo: '1000', varCodigo: 'CKIT', expresion: 'PN-80', orden: 3 },
      { modeloCodigo: '1000', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 4 },

      // Modelo 1010-i
      { modeloCodigo: '1010-i', varCodigo: 'HPF1', expresion: 'ALT1-7', orden: 1 },
      { modeloCodigo: '1010-i', varCodigo: 'BPF1', expresion: 'VAN0-7', orden: 2 },
      { modeloCodigo: '1010-i', varCodigo: 'CKIT', expresion: 'PN-80', orden: 3 },
      { modeloCodigo: '1010-i', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 4 },

      // Modelo 1010-d
      { modeloCodigo: '1010-d', varCodigo: 'HPF1', expresion: 'ALT1-7', orden: 1 },
      { modeloCodigo: '1010-d', varCodigo: 'BPF1', expresion: 'VAN0-7', orden: 2 },
      { modeloCodigo: '1010-d', varCodigo: 'CKIT', expresion: 'PN-80', orden: 3 },
      { modeloCodigo: '1010-d', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 4 },

      // Modelo 1200-i
      { modeloCodigo: '1200-i', varCodigo: 'HPF1', expresion: 'ALT1-7', orden: 1 },
      { modeloCodigo: '1200-i', varCodigo: 'BPF1', expresion: 'VAN1-16', orden: 2 },
      { modeloCodigo: '1200-i', varCodigo: 'BPF2', expresion: 'VAN2-33', orden: 3 },
      { modeloCodigo: '1200-i', varCodigo: 'CKIT', expresion: 'PA-80', orden: 4 },
      { modeloCodigo: '1200-i', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 5 },

      // Modelo 1200-d
      { modeloCodigo: '1200-d', varCodigo: 'HPF1', expresion: 'ALT1-7', orden: 1 },
      { modeloCodigo: '1200-d', varCodigo: 'BPF1', expresion: 'VAN1-16', orden: 2 },
      { modeloCodigo: '1200-d', varCodigo: 'BPF2', expresion: 'VAN2-33', orden: 3 },
      { modeloCodigo: '1200-d', varCodigo: 'CKIT', expresion: 'PA-80', orden: 4 },
      { modeloCodigo: '1200-d', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 5 },

      // Modelo 4000-Ai
      { modeloCodigo: '4000-Ai', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4000-Ai', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4000-Ai', varCodigo: 'BPF1', expresion: '(VAN0/2)-8', orden: 3 },
      { modeloCodigo: '4000-Ai', varCodigo: 'BPU1', expresion: '(VAN0/2)+37', orden: 4 },
      { modeloCodigo: '4000-Ai', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 5 },
      { modeloCodigo: '4000-Ai', varCodigo: 'CKIT', expresion: 'SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-200-1;BF-160-1))', orden: 6 },
      { modeloCodigo: '4000-Ai', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 7 },

      // Modelo 4000-Ad
      { modeloCodigo: '4000-Ad', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4000-Ad', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4000-Ad', varCodigo: 'BPF1', expresion: '(VAN0/2)-8', orden: 3 },
      { modeloCodigo: '4000-Ad', varCodigo: 'BPU1', expresion: '(VAN0/2)+37', orden: 4 },
      { modeloCodigo: '4000-Ad', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 5 },
      { modeloCodigo: '4000-Ad', varCodigo: 'CKIT', expresion: 'SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-200-1;BF-160-1))', orden: 6 },
      { modeloCodigo: '4000-Ad', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 7 },

      // Modelo 4000-Bi
      { modeloCodigo: '4000-Bi', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4000-Bi', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4000-Bi', varCodigo: 'BPF1', expresion: '(VAN0/3)+3', orden: 3 },
      { modeloCodigo: '4000-Bi', varCodigo: 'BPU1', expresion: '(VAN0/3)+48', orden: 4 },
      { modeloCodigo: '4000-Bi', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 5 },
      { modeloCodigo: '4000-Bi', varCodigo: 'CKIT', expresion: 'SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-200-1;BF-160-1))', orden: 6 },
      { modeloCodigo: '4000-Bi', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 7 },

      // Modelo 4000-Bd
      { modeloCodigo: '4000-Bd', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4000-Bd', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4000-Bd', varCodigo: 'BPF1', expresion: '(VAN0/3)+3', orden: 3 },
      { modeloCodigo: '4000-Bd', varCodigo: 'BPU1', expresion: '(VAN0/3)+48', orden: 4 },
      { modeloCodigo: '4000-Bd', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 5 },
      { modeloCodigo: '4000-Bd', varCodigo: 'CKIT', expresion: 'SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-200-1;BF-160-1))', orden: 6 },
      { modeloCodigo: '4000-Bd', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 7 },

      // Modelo 4000-Ci
      { modeloCodigo: '4000-Ci', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4000-Ci', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4000-Ci', varCodigo: 'BPF1', expresion: 'PAF1-8', orden: 3 },
      { modeloCodigo: '4000-Ci', varCodigo: 'BPF2', expresion: '((VAN0-PAF1)/2)+5', orden: 4 },
      { modeloCodigo: '4000-Ci', varCodigo: 'BPU1', expresion: '((VAN0-PAF1)/2)+48', orden: 5 },
      { modeloCodigo: '4000-Ci', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 6 },
      { modeloCodigo: '4000-Ci', varCodigo: 'CKIT', expresion: 'SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-200-1;BF-160-1))', orden: 7 },
      { modeloCodigo: '4000-Ci', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 8 },

      // Modelo 4000-Cd
      { modeloCodigo: '4000-Cd', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4000-Cd', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4000-Cd', varCodigo: 'BPF1', expresion: 'PAF1-8', orden: 3 },
      { modeloCodigo: '4000-Cd', varCodigo: 'BPF2', expresion: '((VAN0-PAF1)/2)+5', orden: 4 },
      { modeloCodigo: '4000-Cd', varCodigo: 'BPU1', expresion: '((VAN0-PAF1)/2)+48', orden: 5 },
      { modeloCodigo: '4000-Cd', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 6 },
      { modeloCodigo: '4000-Cd', varCodigo: 'CKIT', expresion: 'SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-200-1;BF-160-1))', orden: 7 },
      { modeloCodigo: '4000-Cd', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 8 },

      // Modelo 4000-D
      { modeloCodigo: '4000-D', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4000-D', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4000-D', varCodigo: 'BPF1', expresion: '(VAN0/4)-6', orden: 3 },
      { modeloCodigo: '4000-D', varCodigo: 'BPU1', expresion: '(VAN0/4)+39', orden: 4 },
      { modeloCodigo: '4000-D', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 5 },
      { modeloCodigo: '4000-D', varCodigo: 'CKIT', expresion: 'SI(VAN0>2000;BF-250-2;SI(VAN0>1600;BF-200-2;BF-160-2))', orden: 6 },
      { modeloCodigo: '4000-D', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 7 },

      // Modelo 4100
      { modeloCodigo: '4100', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4100', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4100', varCodigo: 'BPF1', expresion: '(VAN1/2)-32', orden: 3 },
      { modeloCodigo: '4100', varCodigo: 'BPF2', expresion: '(VAN2/2)-32', orden: 4 },
      { modeloCodigo: '4100', varCodigo: 'BPU1', expresion: '(VAN1/2)+33', orden: 5 },
      { modeloCodigo: '4100', varCodigo: 'BPU2', expresion: '(VAN2/2)+33', orden: 6 },
      { modeloCodigo: '4100', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 7 },
      { modeloCodigo: '4100', varCodigo: 'CKIT', expresion: 'SI((VAN1+VAN2)>2400;BE-150;SI((VAN1+VAN2)>2000;BE-120;BE-100))', orden: 8 },
      { modeloCodigo: '4100', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 9 },

      // Modelo 4200-A1i
      { modeloCodigo: '4200-A1i', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-A1i', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-A1i', varCodigo: 'BPF1', expresion: '(VAN1/2)-5', orden: 3 },
      { modeloCodigo: '4200-A1i', varCodigo: 'BPF2', expresion: 'VAN2-33', orden: 4 },
      { modeloCodigo: '4200-A1i', varCodigo: 'BPU1', expresion: '(VAN1/2)+26', orden: 5 },
      { modeloCodigo: '4200-A1i', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 6 },
      { modeloCodigo: '4200-A1i', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 7 },
      { modeloCodigo: '4200-A1i', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 8 },

      // Modelo 4200-A1d
      { modeloCodigo: '4200-A1d', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-A1d', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-A1d', varCodigo: 'BPF1', expresion: '(VAN1/2)-5', orden: 3 },
      { modeloCodigo: '4200-A1d', varCodigo: 'BPF2', expresion: 'VAN2-33', orden: 4 },
      { modeloCodigo: '4200-A1d', varCodigo: 'BPU1', expresion: '(VAN1/2)+26', orden: 5 },
      { modeloCodigo: '4200-A1d', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 6 },
      { modeloCodigo: '4200-A1d', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 7 },
      { modeloCodigo: '4200-A1d', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 8 },

      // Modelo 4200-A2i
      { modeloCodigo: '4200-A2i', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-A2i', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-A2i', varCodigo: 'BPF1', expresion: '(VAN1/2)-19', orden: 3 },
      { modeloCodigo: '4200-A2i', varCodigo: 'BPF2', expresion: 'VAN2-36', orden: 4 },
      { modeloCodigo: '4200-A2i', varCodigo: 'BPU1', expresion: '(VAN1/2)+26', orden: 5 },
      { modeloCodigo: '4200-A2i', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 6 },
      { modeloCodigo: '4200-A2i', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 7 },
      { modeloCodigo: '4200-A2i', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 8 },

      // Modelo 4200-A2d
      { modeloCodigo: '4200-A2d', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-A2d', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-A2d', varCodigo: 'BPF1', expresion: '(VAN1/2)-19', orden: 3 },
      { modeloCodigo: '4200-A2d', varCodigo: 'BPF2', expresion: 'VAN2-36', orden: 4 },
      { modeloCodigo: '4200-A2d', varCodigo: 'BPU1', expresion: '(VAN1/2)+26', orden: 5 },
      { modeloCodigo: '4200-A2d', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 6 },
      { modeloCodigo: '4200-A2d', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 7 },
      { modeloCodigo: '4200-A2d', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 8 },

      // Modelo 4200-Bi
      { modeloCodigo: '4200-Bi', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-Bi', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-Bi', varCodigo: 'BPF1', expresion: '(VAN1/3)+15', orden: 3 },
      { modeloCodigo: '4200-Bi', varCodigo: 'BPF2', expresion: '(VAN1/3)-7', orden: 4 },
      { modeloCodigo: '4200-Bi', varCodigo: 'BPF3', expresion: 'VAN2-33', orden: 5 },
      { modeloCodigo: '4200-Bi', varCodigo: 'BPU1', expresion: '(VAN1/3)+38', orden: 6 },
      { modeloCodigo: '4200-Bi', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 7 },
      { modeloCodigo: '4200-Bi', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 8 },
      { modeloCodigo: '4200-Bi', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 9 },

      // Modelo 4200-Bd
      { modeloCodigo: '4200-Bd', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-Bd', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-Bd', varCodigo: 'BPF1', expresion: '(VAN1/3)+15', orden: 3 },
      { modeloCodigo: '4200-Bd', varCodigo: 'BPF2', expresion: '(VAN1/3)-7', orden: 4 },
      { modeloCodigo: '4200-Bd', varCodigo: 'BPF3', expresion: 'VAN2-33', orden: 5 },
      { modeloCodigo: '4200-Bd', varCodigo: 'BPU1', expresion: '(VAN1/3)+38', orden: 6 },
      { modeloCodigo: '4200-Bd', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 7 },
      { modeloCodigo: '4200-Bd', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 8 },
      { modeloCodigo: '4200-Bd', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 9 },

      // Modelo 4200-C1i
      { modeloCodigo: '4200-C1i', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-C1i', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-C1i', varCodigo: 'BPF1', expresion: 'PAF1-8', orden: 3 },
      { modeloCodigo: '4200-C1i', varCodigo: 'BPF2', expresion: '((VAN1-PAF1)/2)+12', orden: 4 },
      { modeloCodigo: '4200-C1i', varCodigo: 'BPF3', expresion: 'VAN2-33', orden: 5 },
      { modeloCodigo: '4200-C1i', varCodigo: 'BPU1', expresion: '((VAN1-PAF1)/2)+33', orden: 6 },
      { modeloCodigo: '4200-C1i', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 7 },
      { modeloCodigo: '4200-C1i', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 8 },
      { modeloCodigo: '4200-C1i', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 9 },

      // Modelo 4200-C1d
      { modeloCodigo: '4200-C1d', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-C1d', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-C1d', varCodigo: 'BPF1', expresion: 'PAF1-8', orden: 3 },
      { modeloCodigo: '4200-C1d', varCodigo: 'BPF2', expresion: '((VAN1-PAF1)/2)+12', orden: 4 },
      { modeloCodigo: '4200-C1d', varCodigo: 'BPF3', expresion: 'VAN2-33', orden: 5 },
      { modeloCodigo: '4200-C1d', varCodigo: 'BPU1', expresion: '((VAN1-PAF1)/2)+33', orden: 6 },
      { modeloCodigo: '4200-C1d', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 7 },
      { modeloCodigo: '4200-C1d', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 8 },
      { modeloCodigo: '4200-C1d', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 9 },

      // Modelo 4200-C2i
      { modeloCodigo: '4200-C2i', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-C2i', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-C2i', varCodigo: 'BPF1', expresion: 'PAF1-16', orden: 3 },
      { modeloCodigo: '4200-C2i', varCodigo: 'BPF2', expresion: '(VAN1-PAF1)/2', orden: 4 },
      { modeloCodigo: '4200-C2i', varCodigo: 'BPF3', expresion: 'VAN2-33', orden: 5 },
      { modeloCodigo: '4200-C2i', varCodigo: 'BPU1', expresion: '((VAN1-PAF1)/2)+44', orden: 6 },
      { modeloCodigo: '4200-C2i', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 7 },
      { modeloCodigo: '4200-C2i', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 8 },
      { modeloCodigo: '4200-C2i', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 9 },

      // Modelo 4200-C2d
      { modeloCodigo: '4200-C2d', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-C2d', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-C2d', varCodigo: 'BPF1', expresion: 'PAF1-16', orden: 3 },
      { modeloCodigo: '4200-C2d', varCodigo: 'BPF2', expresion: '(VAN1-PAF1)/2', orden: 4 },
      { modeloCodigo: '4200-C2d', varCodigo: 'BPF3', expresion: 'VAN2-33', orden: 5 },
      { modeloCodigo: '4200-C2d', varCodigo: 'BPU1', expresion: '((VAN1-PAF1)/2)+44', orden: 6 },
      { modeloCodigo: '4200-C2d', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 7 },
      { modeloCodigo: '4200-C2d', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 8 },
      { modeloCodigo: '4200-C2d', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 9 },

      // Modelo 4200-D
      { modeloCodigo: '4200-D', varCodigo: 'HPF1', expresion: 'ALT1-65', orden: 1 },
      { modeloCodigo: '4200-D', varCodigo: 'HPUE', expresion: 'ALT1-25', orden: 2 },
      { modeloCodigo: '4200-D', varCodigo: 'BPF1', expresion: '(VAN1/4)+8', orden: 3 },
      { modeloCodigo: '4200-D', varCodigo: 'BPF2', expresion: '(VAN1/4)-14', orden: 4 },
      { modeloCodigo: '4200-D', varCodigo: 'BPF3', expresion: 'VAN2-33', orden: 5 },
      { modeloCodigo: '4200-D', varCodigo: 'BPU1', expresion: '(VAN1/4)+31', orden: 6 },
      { modeloCodigo: '4200-D', varCodigo: 'DEBI', expresion: 'SI(ALT1>1600;900;700)', orden: 7 },
      { modeloCodigo: '4200-D', varCodigo: 'CKIT', expresion: 'SI(VAN1>2000;BA-250;SI(VAN1>1600;BA-200;BA-160))', orden: 8 },
      { modeloCodigo: '4200-D', varCodigo: 'HKIT', expresion: 'SI(ALT1>1600;"x 200";"x 160")', orden: 9 },
    ];

    let formulasCount = 0;
    for (const formulaData of formulasData) {
      const modelo = modelosMap.get(formulaData.modeloCodigo);
      const variable = variablesCalcMap.get(formulaData.varCodigo);

      if (!modelo || !variable) {
        console.log(`  ⚠ No se encontró modelo ${formulaData.modeloCodigo} o variable ${formulaData.varCodigo}`);
        continue;
      }

      const formula = formulaRepo.create({
        modelo: modelo,
        modeloId: modelo.id,
        variable: variable,
        variableId: variable.id,
        expresion: formulaData.expresion,
        orden: formulaData.orden,
        activa: true,
      });
      await formulaRepo.save(formula);
      formulasCount++;
    }
    console.log(`  ✓ ${formulasCount} fórmulas creadas`);

    console.log('\n✅ Seed completado exitosamente!\n');
    console.log('📊 Resumen de datos creados:');
    console.log(`   • ${comprobantes.length} Comprobantes`);
    console.log(`   • ${vidrios.length} Vidrios`);
    console.log(`   • ${servicios.length} Servicios`);
    console.log(`   • ${herrajes.length} Herrajes`);
    console.log(`   • ${accesorios.length} Accesorios`);
    console.log(`   • ${variables.length} Variables de entrada`);
    console.log(`   • ${instrucciones.length} Instrucciones`);
    console.log(`   • ${productos.length} Productos`);
    console.log(`   • ${valoresFijos.length} Valores Fijos`);
    console.log(`   • ${kits.length} Kits`);
    console.log(`   • ${modelos.length} Modelos de fórmulas`);
    console.log(`   • ${variablesCalculadas.length} Variables calculadas`);
    console.log(`   • ${formulasCount} Fórmulas\n`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

// Ejecutar seed
seed()
  .then(() => {
    console.log('🎉 Proceso de seed finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
