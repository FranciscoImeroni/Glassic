import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Variable } from '../modules/productos/entities/variable.entity';
import { Producto } from '../modules/productos/entities/producto.entity';
import { Modelo } from '../modules/formulas/entities/modelo.entity';
import { VariableCalculada } from '../modules/formulas/entities/formula.entity';
import { FormulaCalculada } from '../modules/formulas/entities/formula-calculada.entity';
import { Comprobante } from '../modules/datos/entities/comprobante.entity';
import { Vidrio } from '../modules/datos/entities/vidrio.entity';
import { Herraje } from '../modules/datos/entities/herraje.entity';
import { Servicio } from '../modules/datos/entities/servicio.entity';
import { Accesorio } from '../modules/datos/entities/accesorio.entity';

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
      { codigo: 'ALT1', nombre: 'Altura' },
      { codigo: 'VAN0', nombre: 'Vano' },
      { codigo: 'BAS2', nombre: 'Base' },
    ];

    const variablesCreadas: Variable[] = [];
    for (const varData of variables) {
      const existing = await variableRepo.findOne({ where: { codigo: varData.codigo } });
      if (!existing) {
        const variable = variableRepo.create(varData);
        variablesCreadas.push(await variableRepo.save(variable));
        console.log(`  ✓ Variable ${varData.codigo} creada`);
      } else {
        variablesCreadas.push(existing);
        console.log(`  • Variable ${varData.codigo} ya existe`);
      }
    }

    // 2. Productos
    console.log('\n📦 Creando productos...');
    const productoRepo = dataSource.getRepository(Producto);

    const productos = [
      {
        linea: 'Linea 1000',
        serie: 'Serie A',
        modelo: '1000-d',
        varVi: 'ALT1,VAN0',
        codIvi: '',
        espVidrio: 6,
        variables: [variablesCreadas[0], variablesCreadas[1]], // ALT1, VAN0
      },
      {
        linea: 'Linea 4000',
        serie: 'Serie A',
        modelo: '4000-A1i',
        varVi: 'ALT1,BAS2',
        codIvi: '',
        espVidrio: 8,
        variables: [variablesCreadas[0], variablesCreadas[2]], // ALT1, BAS2
      },
    ];

    const productosCreados: Producto[] = [];
    for (const prodData of productos) {
      const existing = await productoRepo.findOne({
        where: { modelo: prodData.modelo },
        relations: ['variables']
      });

      if (!existing) {
        const producto = productoRepo.create(prodData);
        productosCreados.push(await productoRepo.save(producto));
        console.log(`  ✓ Producto ${prodData.modelo} creado`);
      } else {
        productosCreados.push(existing);
        console.log(`  • Producto ${prodData.modelo} ya existe`);
      }
    }

    // 3. Modelos (para fórmulas)
    console.log('\n🔧 Creando modelos de fórmulas...');
    const modeloRepo = dataSource.getRepository(Modelo);

    const modelos = [
      { codigo: '1000-d', descripcion: 'Modelo 1000 derecho' },
      { codigo: '4000-A1i', descripcion: 'Modelo 4000 A1 izquierdo' },
    ];

    const modelosCreados: Modelo[] = [];
    for (const modeloData of modelos) {
      let modelo = await modeloRepo.findOne({ where: { codigo: modeloData.codigo } });
      if (!modelo) {
        modelo = modeloRepo.create(modeloData);
        await modeloRepo.save(modelo);
        console.log(`  ✓ Modelo ${modeloData.codigo} creado`);
      } else {
        console.log(`  • Modelo ${modeloData.codigo} ya existe`);
      }
      modelosCreados.push(modelo);
    }

    // 4. Variables calculadas
    console.log('\n📊 Creando variables calculadas...');
    const varCalcRepo = dataSource.getRepository(VariableCalculada);

    const variablesCalculadas = [
      { codigo: 'HPF1', descripcion: 'Altura Paño Fijo 1', tipoSalida: 'number' as const },
      { codigo: 'BPF1', descripcion: 'Base Paño Fijo 1', tipoSalida: 'number' as const },
      { codigo: 'HPF2', descripcion: 'Altura Paño Fijo 2', tipoSalida: 'number' as const },
      { codigo: 'BPF2', descripcion: 'Base Paño Fijo 2', tipoSalida: 'number' as const },
    ];

    const variablesCalcCreadas: VariableCalculada[] = [];
    for (const varData of variablesCalculadas) {
      let varCalc = await varCalcRepo.findOne({ where: { codigo: varData.codigo } });
      if (!varCalc) {
        varCalc = varCalcRepo.create(varData);
        await varCalcRepo.save(varCalc);
        console.log(`  ✓ Variable calculada ${varData.codigo} creada`);
      } else {
        console.log(`  • Variable calculada ${varData.codigo} ya existe`);
      }
      variablesCalcCreadas.push(varCalc);
    }

    // 5. Fórmulas calculadas
    console.log('\n🧮 Creando fórmulas...');
    const formulaRepo = dataSource.getRepository(FormulaCalculada);

    const formulas = [
      {
        modelo: modelosCreados[0], // 1000-d
        variable: variablesCalcCreadas[0], // HPF1
        expresion: 'ALT1-7',
        orden: 1,
      },
      {
        modelo: modelosCreados[0], // 1000-d
        variable: variablesCalcCreadas[1], // BPF1
        expresion: 'SI(VAN0>1600;900;700)',
        orden: 2,
      },
      {
        modelo: modelosCreados[1], // 4000-A1i
        variable: variablesCalcCreadas[2], // HPF2
        expresion: 'ALT1-10',
        orden: 1,
      },
      {
        modelo: modelosCreados[1], // 4000-A1i
        variable: variablesCalcCreadas[3], // BPF2
        expresion: 'BAS2/2',
        orden: 2,
      },
    ];

    for (const formulaData of formulas) {
      const existing = await formulaRepo.findOne({
        where: {
          modeloId: formulaData.modelo.id,
          variableId: formulaData.variable.id,
        },
      });

      if (!existing) {
        const formula = formulaRepo.create({
          modelo: formulaData.modelo,
          modeloId: formulaData.modelo.id,
          variable: formulaData.variable,
          variableId: formulaData.variable.id,
          expresion: formulaData.expresion,
          orden: formulaData.orden,
          activa: true,
        });
        await formulaRepo.save(formula);
        console.log(`  ✓ Fórmula ${formulaData.variable.codigo} para ${formulaData.modelo.codigo} creada`);
      } else {
        console.log(`  • Fórmula ${formulaData.variable.codigo} para ${formulaData.modelo.codigo} ya existe`);
      }
    }

    // 6. Comprobantes
    console.log('\n📋 Creando comprobantes...');
    const comprobanteRepo = dataSource.getRepository(Comprobante);

    const comprobantes = [
      { codigo: 'NP', descripcion: 'Nota de Pedido' },
      { codigo: 'OC', descripcion: 'Orden de Compra' },
      { codigo: 'FC', descripcion: 'Factura' },
      { codigo: 'PR', descripcion: 'Presupuesto' },
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

    // 7. Vidrios
    console.log('\n🪟 Creando vidrios...');
    const vidrioRepo = dataSource.getRepository(Vidrio);

    const vidrios = [
      { tipo: 'Float', color: 'Incoloro' },
      { tipo: 'Float', color: 'Bronce' },
      { tipo: 'Float', color: 'Verde' },
      { tipo: 'Laminado', color: 'Incoloro' },
      { tipo: 'Templado', color: 'Incoloro' },
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

    // 8. Herrajes
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

    // 9. Servicios
    console.log('\n🛠️  Creando servicios...');
    const servicioRepo = dataSource.getRepository(Servicio);

    const servicios = [
      { nombre: 'Fabricación e Instalación' },
      { nombre: 'Solo Fabricación' },
      { nombre: 'Solo Instalación' },
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

    // 10. Accesorios
    console.log('\n🔧 Creando accesorios...');
    const accesorioRepo = dataSource.getRepository(Accesorio);

    const accesorios = [
      { descripcion: 'Bisagra hidráulica' },
      { descripcion: 'Cerradura embutir' },
      { descripcion: 'Manija recta' },
      { descripcion: 'Tirador redondo' },
      { descripcion: 'Burlete' },
      { descripcion: 'Silicona' },
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

    console.log('\n✅ Seed completado exitosamente!\n');
    console.log('📊 Resumen de datos creados:');
    console.log(`   • ${variables.length} Variables de entrada`);
    console.log(`   • ${productos.length} Productos`);
    console.log(`   • ${modelos.length} Modelos de fórmulas`);
    console.log(`   • ${variablesCalculadas.length} Variables calculadas`);
    console.log(`   • ${formulas.length} Fórmulas`);
    console.log(`   • ${comprobantes.length} Comprobantes`);
    console.log(`   • ${vidrios.length} Vidrios`);
    console.log(`   • ${herrajes.length} Herrajes`);
    console.log(`   • ${servicios.length} Servicios`);
    console.log(`   • ${accesorios.length} Accesorios\n`);

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
