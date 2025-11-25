import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Variable } from '../modules/productos/entities/variable.entity';
import { Producto } from '../modules/productos/entities/producto.entity';
import { Modelo } from '../modules/formulas/entities/modelo.entity';
import { Comprobante } from '../modules/datos/entities/comprobante.entity';
import { Vidrio } from '../modules/datos/entities/vidrio.entity';
import { Herraje } from '../modules/datos/entities/herraje.entity';
import { Servicio } from '../modules/datos/entities/servicio.entity';
import { Accesorio } from '../modules/datos/entities/accesorio.entity';
import { CodigoInstruccion } from '../modules/productos/entities/codigo-instruccion.entity';
import { ValoresFijos } from '../modules/configuracion/entities/configuracion.entity';
import { Kits } from '../modules/configuracion/entities/kits.entity';

config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // 1. Variables de entrada
    console.log('\n📝 Creando variables de entrada...');
    const variableRepo = dataSource.getRepository(Variable);

    const variables = [
      { codigo: 'ALT1', nombre: 'Altura 1' },
      { codigo: 'VAN0', nombre: 'Vano 0' },
      { codigo: 'VANO1', nombre: 'Vano 1' },
      { codigo: 'VANO2', nombre: 'Vano 2' },
      { codigo: 'PAF1', nombre: 'Paño Fijo 1' },
      { codigo: 'BAS2', nombre: 'Base 2' },
      { codigo: 'ALT2', nombre: 'Altura 2' },
      { codigo: 'BAS3', nombre: 'Base 3' },
      { codigo: 'BAS4', nombre: 'Base 4' },
      { codigo: 'ALT3', nombre: 'Altura 3' },
      { codigo: 'ALT4', nombre: 'Altura 4' },
    ];

    const variablesMap = new Map<string, Variable>();
    for (const varData of variables) {
      let variable = await variableRepo.findOne({ where: { codigo: varData.codigo } });
      if (!variable) {
        variable = variableRepo.create(varData);
        await variableRepo.save(variable);
        console.log(`  ✓ Variable ${varData.codigo} creada`);
      } else {
        console.log(`  • Variable ${varData.codigo} ya existe`);
      }
      variablesMap.set(varData.codigo, variable);
    }

    // 2. Instrucciones
    console.log('\n📋 Creando instrucciones...');
    const instruccionRepo = dataSource.getRepository(CodigoInstruccion);

    const instrucciones = [
      { codigo: '1001', instruccion: 'Ancho Std. 800mm' },
      { codigo: '1002', instruccion: 'Apertura de puerta hacia afuera' },
      { codigo: '1003', instruccion: 'Apertura de puerta hacia adentro' },
      { codigo: '1004', instruccion: 'Con toallero' },
      { codigo: '1005', instruccion: 'Sin toallero' },
      { codigo: '1006', instruccion: 'Paño fijo a la derecha' },
      { codigo: '1007', instruccion: 'Paño fijo a la izquierda' },
      { codigo: '1008', instruccion: 'Guías en U' },
      { codigo: '1009', instruccion: 'Bisagras a la izquierda' },
      { codigo: '1010', instruccion: 'Bisagras a la derecha' },
    ];

    const instruccionesMap = new Map<string, CodigoInstruccion>();
    for (const instData of instrucciones) {
      let instruccion = await instruccionRepo.findOne({ where: { codigo: instData.codigo } });
      if (!instruccion) {
        instruccion = instruccionRepo.create(instData);
        await instruccionRepo.save(instruccion);
        console.log(`  ✓ Instrucción ${instData.codigo} creada`);
      } else {
        console.log(`  • Instrucción ${instData.codigo} ya existe`);
      }
      instruccionesMap.set(instData.codigo, instruccion);
    }

    // 3. Productos
    console.log('\n📦 Creando productos...');
    const productoRepo = dataSource.getRepository(Producto);

    const productos = [
      { linea: 'LINEA 1000', serie: '1000', modelo: '1000-d', varVi: 'VAN0,ALT1', codIvi: '1002.1005.1008', espVidrio: 6 },
      { linea: 'LINEA 1000', serie: '1010', modelo: '1010-d', varVi: 'VAN0,ALT1', codIvi: '1002.1005.1008.1010', espVidrio: 6 },
      { linea: 'LINEA 1000', serie: '1010', modelo: '1010-i', varVi: 'VAN0,ALT1', codIvi: '1002.1005.1008.1009', espVidrio: 6 },
      { linea: 'LINEA 1000', serie: '1200', modelo: '1200-d', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005.1008.1010.1006', espVidrio: 6 },
      { linea: 'LINEA 1000', serie: '1200', modelo: '1200-i', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005.1008.1009.1007', espVidrio: 6 },
      { linea: 'LINEA 4000', serie: '4000', modelo: '4000-Ai', varVi: 'VAN0,ALT1', codIvi: '1002.1005.1009', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4000', modelo: '4000-Ad', varVi: 'VAN0,ALT1', codIvi: '1002.1005.1010', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4000', modelo: '4000-Bi', varVi: 'VAN0,ALT1', codIvi: '1002.1005.1009', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4000', modelo: '4000-Bd', varVi: 'VAN0,ALT1', codIvi: '1002.1005.1010', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4000', modelo: '4000-Ci', varVi: 'VAN0,ALT1,PAF1', codIvi: '1002.1005.1009.1007', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4000', modelo: '4000-Cd', varVi: 'VAN0,ALT1,PAF1', codIvi: '1002.1005.1010.1006', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4000', modelo: '4000-D', varVi: 'VAN0,ALT1', codIvi: '1002.1005', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4100', modelo: '4100', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-A1i', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005.1009.1006', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-A1d', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005.1010.1007', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-A2i', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005.1009.1006', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-A2d', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005.1010.1007', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-Bi', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005.1009.1006', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-Bd', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005.1010.1007', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-Ci', varVi: 'VANO1,VANO2,ALT1,PAF1', codIvi: '1002.1005.1009.1007', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-C1d', varVi: 'VANO1,VANO2,ALT1,PAF1', codIvi: '1002.1005.1010.1006', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-C2i', varVi: 'VANO1,VANO2,ALT1,PAF1', codIvi: '1002.1005.1009.1007', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-C2d', varVi: 'VANO1,VANO2,ALT1,PAF1', codIvi: '1002.1005.1010.1006', espVidrio: 8 },
      { linea: 'LINEA 4000', serie: '4200', modelo: '4200-D', varVi: 'VANO1,VANO2,ALT1', codIvi: '1002.1005', espVidrio: 8 },
    ];

    for (const prodData of productos) {
      let producto = await productoRepo.findOne({
        where: { modelo: prodData.modelo },
        relations: ['variables', 'instrucciones']
      });

      // Obtener variables asociadas
      const varCodes = prodData.varVi.split(',').map(v => v.trim()).filter(v => v);
      const varsAsociadas = varCodes.map(code => variablesMap.get(code)).filter(v => v !== undefined) as Variable[];

      // Obtener instrucciones asociadas
      const instCodes = prodData.codIvi.split('.').map(i => i.trim()).filter(i => i);
      const instsAsociadas = instCodes.map(code => instruccionesMap.get(code)).filter(i => i !== undefined) as CodigoInstruccion[];

      if (!producto) {
        producto = productoRepo.create({
          ...prodData,
          variables: varsAsociadas,
          instrucciones: instsAsociadas,
        });
        await productoRepo.save(producto);
        console.log(`  ✓ Producto ${prodData.modelo} creado`);
      } else {
        // Actualizar producto existente
        producto.linea = prodData.linea;
        producto.serie = prodData.serie;
        producto.varVi = prodData.varVi;
        producto.codIvi = prodData.codIvi;
        producto.espVidrio = prodData.espVidrio;
        producto.variables = varsAsociadas;
        producto.instrucciones = instsAsociadas;
        await productoRepo.save(producto);
        console.log(`  ✓ Producto ${prodData.modelo} actualizado`);
      }
    }

    // 4. Modelos (con fórmulas desnormalizadas)
    console.log('\n🔧 Creando modelos de fórmulas...');
    const modeloRepo = dataSource.getRepository(Modelo);

    const modelos = [
      { codigo: '1000-d', descripcion: 'Modelo 1000-d', hpf1: 'ALT1-7', bpf1: 'VAN0-7', ckit: '"PN-80"', hkit: 'SI(ALT1>1600;"x 200";"x 160")' },
      { codigo: '1010-i', descripcion: 'Modelo 1010 izquierdo', hpf1: 'ALT1-7', bpf1: 'VAN0-7', ckit: '"PN-80"', hkit: 'SI(ALT1>1600;"x 200";"x 160")' },
      { codigo: '1010-d', descripcion: 'Modelo 1010 derecho', hpf1: 'ALT1-7', bpf1: 'VAN0-7', ckit: '"PN-80"', hkit: 'SI(ALT1>1600;"x 200";"x 160")' },
      { codigo: '1200-i', descripcion: 'Modelo 1200 izquierdo', hpf1: 'ALT1-7', bpf1: 'VANO1-16', bpf2: 'VANO2-33', ckit: '"PA-80"', hkit: 'SI(ALT1>1600;"x 200";"x 160")' },
      { codigo: '1200-d', descripcion: 'Modelo 1200 derecho', hpf1: 'ALT1-7', bpf1: 'VANO1-16', bpf2: 'VANO2-33', ckit: '"PA-80"', hkit: 'SI(ALT1>1600;"x 200";"x 160")' },
      { codigo: '4000-Ai', descripcion: 'Modelo 4000 A1 izquierdo', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VAN0/2)-8', bpu1: '(VAN0/2)+37', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4000-Ad', descripcion: 'Modelo 4000 Ad', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VAN0/2)-8', bpu1: '(VAN0/2)+37', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4000-Bi', descripcion: 'Modelo 4000 Bi', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VAN0/3)+3', bpu1: '(VAN0/3)+48', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4000-Bd', descripcion: 'Modelo 4000 Bd', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VAN0/3)+3', bpu1: '(VAN0/3)+48', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4000-Ci', descripcion: 'Modelo 4000 Ci', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '((VAN0-PAF1)/2)+5', bpu1: '((VAN0-PAF1)/2)+48', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4000-Cd', descripcion: 'Modelo 4000 Cd', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: 'PAF1-8', bpf2: '((VAN0-PAF1)/2)+5', bpu1: '((VAN0-PAF1)/2)+48', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4000-D', descripcion: 'Modelo 4000 D', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VAN0/4)+8', bpf2: '(VAN0/4)+4', bpu1: '(VAN0/4)+39', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4100', descripcion: 'Modelo 4100', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VANO1/2)-32', bpf2: '(VANO2/2)-32', bpf4: '(VANO2/2)+33', bpu1: '(VANO1/2)+33', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-A1i', descripcion: 'Modelo 4200 A1i', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VANO1/2)-5', bpf2: 'VANO2-33', bpu1: '(VANO1/2)+26', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-A1d', descripcion: 'Modelo 4200 A1d', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VANO1/2)-5', bpf2: 'VANO2-33', bpu1: '(VANO1/2)+26', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-A2i', descripcion: 'Modelo 4200 A2i', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VANO1/2)-19', bpf2: 'VANO2-36', bpu1: '(VANO1/2)+26', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-A2d', descripcion: 'Modelo 4200 A2d', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VANO1/2)-19', bpf2: 'VANO2-36', bpu1: '(VANO1/2)+26', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-Bi', descripcion: 'Modelo 4200 Bi', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VANO1/3)+15', bpf2: '(VANO1/3)-7', bpf3: 'VANO2-33', bpu1: '(VANO1/3)+38', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-Bd', descripcion: 'Modelo 4200 Bd', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VANO1/3)+15', bpf2: '(VANO1/3)-7', bpf3: 'VANO2-33', bpu1: '(VANO1/3)+38', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-Ci', descripcion: 'Modelo 4200 Ci', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: 'PAF1-8', bpf2: '((VANO1-PAF1)/2)+12', bpf3: 'VANO2-33', bpu1: '((VANO1-PAF1)/2)+33', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-C1d', descripcion: 'Modelo 4200 C1d', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: 'PAF1-8', bpf2: '((VANO1-PAF1)/2)+12', bpf3: 'VANO2-33', bpu1: '((VANO1-PAF1)/2)+33', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-C2i', descripcion: 'Modelo 4200 C2i', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: 'PAF1-16', bpf2: '((VANO1-PAF1)/2)', bpf3: 'VANO2-33', bpu1: '((VANO1-PAF1)/2)+44', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-C2d', descripcion: 'Modelo 4200 C2d', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: 'PAF1-16', bpf2: '((VANO1-PAF1)/2)', bpf3: 'VANO2-33', bpu1: '((VANO1-PAF1)/2)+44', hkit: 'SI(ALT1>1600;900;700)' },
      { codigo: '4200-D', descripcion: 'Modelo 4200 D', hpf1: 'ALT1-65', hpf2: 'ALT1-25', bpf1: '(VANO1/4)+8', bpf2: '(VANO1/4)+4', bpf3: 'VANO2-33', bpu1: '(VANO1/4)+31', hkit: 'SI(ALT1>1600;900;700)' },
    ];

    for (const modeloData of modelos) {
      let modelo = await modeloRepo.findOne({ where: { codigo: modeloData.codigo } });
      if (!modelo) {
        modelo = modeloRepo.create(modeloData);
        await modeloRepo.save(modelo);
        console.log(`  ✓ Modelo ${modeloData.codigo} creado`);
      } else {
        // Actualizar modelo existente con las fórmulas
        Object.assign(modelo, modeloData);
        await modeloRepo.save(modelo);
        console.log(`  ✓ Modelo ${modeloData.codigo} actualizado con fórmulas`);
      }
    }

    // 5. Comprobantes
    console.log('\n📋 Creando comprobantes...');
    const comprobanteRepo = dataSource.getRepository(Comprobante);

    const comprobantes = [
      { codigo: 'NP', descripcion: 'Nota de Pedido' },
      { codigo: 'OC', descripcion: 'Orden de Compra' },
      { codigo: 'A', descripcion: 'Comprobante A' },
      { codigo: 'B', descripcion: 'Comprobante B' },
      { codigo: 'R', descripcion: 'Recibo' },
      { codigo: 'X', descripcion: 'Otro' },
    ];

    for (const compData of comprobantes) {
      const existing = await comprobanteRepo.findOne({ where: { codigo: compData.codigo } });
      if (!existing) {
        const comp = comprobanteRepo.create(compData);
        await comprobanteRepo.save(comp);
        console.log(`  ✓ Comprobante ${compData.codigo} creado`);
      } else {
        console.log(`  • Comprobante ${compData.codigo} ya existe`);
      }
    }

    // 6. Vidrios
    console.log('\n🪟 Creando vidrios...');
    const vidrioRepo = dataSource.getRepository(Vidrio);

    const vidrios = [
      { tipo: 'Float', color: 'Incoloro' },
      { tipo: 'Float', color: 'Bronce' },
      { tipo: 'Float', color: 'Gris' },
      { tipo: 'Float', color: 'Verde' },
      { tipo: 'Float', color: 'Azul' },
      { tipo: 'Laminado', color: 'Incoloro' },
      { tipo: 'Laminado', color: 'Bronce' },
      { tipo: 'Laminado', color: 'Gris' },
      { tipo: 'Laminado', color: 'Verde' },
      { tipo: 'Templado', color: 'Incoloro' },
      { tipo: 'Templado', color: 'Bronce' },
      { tipo: 'Templado', color: 'Gris' },
      { tipo: 'Templado', color: 'Verde' },
    ];

    for (const vidrioData of vidrios) {
      const existing = await vidrioRepo.findOne({
        where: {
          tipo: vidrioData.tipo,
          color: vidrioData.color,
        },
      });

      if (!existing) {
        const vidrio = vidrioRepo.create(vidrioData);
        await vidrioRepo.save(vidrio);
        console.log(`  ✓ Vidrio ${vidrioData.tipo} ${vidrioData.color} creado`);
      } else {
        console.log(`  • Vidrio ${vidrioData.tipo} ${vidrioData.color} ya existe`);
      }
    }

    // 7. Herrajes
    console.log('\n🔩 Creando herrajes...');
    const herrajeRepo = dataSource.getRepository(Herraje);

    const herrajes = [
      { color: 'Natural' },
      { color: 'Negro' },
      { color: 'Blanco' },
      { color: 'Bronce' },
    ];

    for (const herrajeData of herrajes) {
      const existing = await herrajeRepo.findOne({ where: { color: herrajeData.color } });
      if (!existing) {
        const herraje = herrajeRepo.create(herrajeData);
        await herrajeRepo.save(herraje);
        console.log(`  ✓ Herraje ${herrajeData.color} creado`);
      } else {
        console.log(`  • Herraje ${herrajeData.color} ya existe`);
      }
    }

    // 8. Servicios
    console.log('\n🛠️  Creando servicios...');
    const servicioRepo = dataSource.getRepository(Servicio);

    const servicios = [
      { nombre: 'COLOCADO' },
      { nombre: 'ENTREGADO' },
      { nombre: 'VENDIDO-SIN-COLOCAR' },
    ];

    for (const servicioData of servicios) {
      const existing = await servicioRepo.findOne({ where: { nombre: servicioData.nombre } });
      if (!existing) {
        const servicio = servicioRepo.create(servicioData);
        await servicioRepo.save(servicio);
        console.log(`  ✓ Servicio "${servicioData.nombre}" creado`);
      } else {
        console.log(`  • Servicio "${servicioData.nombre}" ya existe`);
      }
    }

    // 9. Accesorios
    console.log('\n🔧 Creando accesorios...');
    const accesorioRepo = dataSource.getRepository(Accesorio);

    const accesorios = [
      { descripcion: 'TIRADOR REDONDO EXTER. CRISTAL' },
      { descripcion: 'TOALLERO CRISTAL' },
      { descripcion: 'VIDRIO LAMINADO C/VINILO TRANSPAR' },
      { descripcion: 'VIDRIO LAMINADO C/VINILO ARENA' },
      { descripcion: 'VIDRIO LAMINADO C/VINILO SATINADO' },
      { descripcion: 'VIDRIO TEMPLADO INCOLORO' },
      { descripcion: 'ARENADO TOTAL' },
      { descripcion: 'ARENADO PARCIAL' },
      { descripcion: 'PULIDO PERIMETRAL' },
      { descripcion: 'BURLETES PERIMETRALES' },
      { descripcion: 'BURLETE INFERIOR' },
      { descripcion: 'BURLETE INFERIOR+RESORTES' },
      { descripcion: 'BURLETE LATERAL' },
      { descripcion: 'BURLETE LATERAL CON FLECOS' },
      { descripcion: 'TIRADOR CUAD. 150 MM' },
      { descripcion: 'TIRADOR REDONDO EXTR. METAL' },
      { descripcion: 'CERRADURA EMBUTIR' },
      { descripcion: 'BISAGRA HIDRAULICA' },
      { descripcion: 'KIT ANGULAR' },
      { descripcion: 'KIT PARALELO' },
    ];

    for (const accData of accesorios) {
      const existing = await accesorioRepo.findOne({ where: { descripcion: accData.descripcion } });
      if (!existing) {
        const acc = accesorioRepo.create(accData);
        await accesorioRepo.save(acc);
        console.log(`  ✓ Accesorio "${accData.descripcion}" creado`);
      } else {
        console.log(`  • Accesorio "${accData.descripcion}" ya existe`);
      }
    }

    // 10. Valores Fijos
    console.log('\n📊 Creando valores fijos...');
    const valoresFijosRepo = dataSource.getRepository(ValoresFijos);

    const valoresFijos = [
      { codigo: 'VAN0', descripcion: 'Vano Variable 0', valorMm: 25.5 },
      { codigo: 'VAN1', descripcion: 'Vano Variable 1', valorMm: 32.0 },
      { codigo: 'VAN2', descripcion: 'Vano Variable 2', valorMm: 16.0 },
      { codigo: 'PAF0', descripcion: 'Paño Fijo 0', valorMm: 8.0 },
      { codigo: 'PAF1', descripcion: 'Paño Fijo 1', valorMm: 5.0 },
      { codigo: 'ALT0', descripcion: 'Altura 0', valorMm: 7.0 },
      { codigo: 'ALT1', descripcion: 'Altura 1', valorMm: 65.0 },
      { codigo: 'BAS0', descripcion: 'Base 0', valorMm: 33.0 },
      { codigo: 'ESP0', descripcion: 'Espesor 0', valorMm: 6.0 },
      { codigo: 'ESP1', descripcion: 'Espesor 1', valorMm: 8.0 },
    ];

    for (const vfData of valoresFijos) {
      const existing = await valoresFijosRepo.findOne({ where: { codigo: vfData.codigo } });
      if (!existing) {
        const vf = valoresFijosRepo.create(vfData);
        await valoresFijosRepo.save(vf);
        console.log(`  ✓ Valor Fijo ${vfData.codigo} creado`);
      } else {
        console.log(`  • Valor Fijo ${vfData.codigo} ya existe`);
      }
    }

    // 11. Kits
    console.log('\n📦 Creando kits...');
    const kitsRepo = dataSource.getRepository(Kits);

    const kits = [
      { codigo: 'A01000', serieMampara: '1000', nombreKit: 'KIT ANGULAR MAMPARA 1000 MM' },
      { codigo: 'A01010', serieMampara: '1010', nombreKit: 'KIT ANGULAR MAMPARA 1010 MM' },
      { codigo: 'A01200', serieMampara: '1200', nombreKit: 'KIT ANGULAR MAMPARA 1200 MM' },
      { codigo: 'A04000', serieMampara: '4000', nombreKit: 'KIT ANGULAR MAMPARA 4000 MM' },
      { codigo: 'A04100', serieMampara: '4100', nombreKit: 'KIT ANGULAR MAMPARA 4100 MM' },
      { codigo: 'A04200', serieMampara: '4200', nombreKit: 'KIT ANGULAR MAMPARA 4200 MM' },
      { codigo: 'P01000', serieMampara: '1000', nombreKit: 'KIT PARALELO MAMPARA 1000 MM' },
      { codigo: 'P01010', serieMampara: '1010', nombreKit: 'KIT PARALELO MAMPARA 1010 MM' },
      { codigo: 'P01200', serieMampara: '1200', nombreKit: 'KIT PARALELO MAMPARA 1200 MM' },
      { codigo: 'P04000', serieMampara: '4000', nombreKit: 'KIT PARALELO MAMPARA 4000 MM' },
      { codigo: 'P04100', serieMampara: '4100', nombreKit: 'KIT PARALELO MAMPARA 4100 MM' },
      { codigo: 'P04200', serieMampara: '4200', nombreKit: 'KIT PARALELO MAMPARA 4200 MM' },
      { codigo: 'BF-250-1', serieMampara: 'UNIVERSAL', nombreKit: 'BARRA DE FIJACION 250 CM SIMPLE' },
      { codigo: 'BF-250-2', serieMampara: 'UNIVERSAL', nombreKit: 'BARRA DE FIJACION 250 CM DOBLE' },
    ];

    for (const kitData of kits) {
      const existing = await kitsRepo.findOne({ where: { codigo: kitData.codigo } });
      if (!existing) {
        const kit = kitsRepo.create(kitData);
        await kitsRepo.save(kit);
        console.log(`  ✓ Kit ${kitData.codigo} creado`);
      } else {
        console.log(`  • Kit ${kitData.codigo} ya existe`);
      }
    }

    console.log('\n✅ Seed completado exitosamente!\n');
    console.log('📊 Resumen de datos creados:');
    console.log(`   • ${variables.length} Variables de entrada`);
    console.log(`   • ${instrucciones.length} Instrucciones`);
    console.log(`   • ${productos.length} Productos`);
    console.log(`   • ${modelos.length} Modelos con fórmulas`);
    console.log(`   • ${comprobantes.length} Comprobantes`);
    console.log(`   • ${vidrios.length} Vidrios`);
    console.log(`   • ${herrajes.length} Herrajes`);
    console.log(`   • ${servicios.length} Servicios`);
    console.log(`   • ${accesorios.length} Accesorios`);
    console.log(`   • ${valoresFijos.length} Valores Fijos`);
    console.log(`   • ${kits.length} Kits\n`);

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
