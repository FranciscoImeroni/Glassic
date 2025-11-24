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
      {
        codigo: '1000',
        descripcion: 'Modelo 1000',
        hpf1: 'ALT1-7',
        bpf1: 'VAN0-7',
        ckit: 'PN-80',
        hkit: 'SI(ALT1>1600;"x 200";"x 160")',
      },
      {
        codigo: '1010-i',
        descripcion: 'Modelo 1010 izquierdo',
        hpf1: 'ALT1-7',
        bpf1: 'VAN0-7',
        ckit: 'PN-80',
        hkit: 'SI(ALT1>1600;"x 200";"x 160")',
      },
      {
        codigo: '1010-d',
        descripcion: 'Modelo 1010 derecho',
        hpf1: 'ALT1-7',
        bpf1: 'VAN0-7',
        ckit: 'PN-80',
        hkit: 'SI(ALT1>1600;"x 200";"x 160")',
      },
      {
        codigo: '1200-i',
        descripcion: 'Modelo 1200 izquierdo',
        hpf1: 'ALT1-7',
        bpf1: 'VANO1-16',
        bpf2: 'VANO2-33',
        ckit: 'PA-80',
        hkit: 'SI(ALT1>1600;"x 200";"x 160")',
      },
      {
        codigo: '1200-d',
        descripcion: 'Modelo 1200 derecho',
        hpf1: 'ALT1-7',
        bpf1: 'VANO1-16',
        bpf2: 'VANO2-33',
        ckit: 'PA-80',
        hkit: 'SI(ALT1>1600;"x 200";"x 160")',
      },
      {
        codigo: '4000-A1i',
        descripcion: 'Modelo 4000 A1 izquierdo',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VAN0/2)-8',
        bpu1: '(VAN0/2)+37',
        hkit: 'SI(ALT1>1600;900;700) =SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-250-1;SI(ALT1>1600;"x 200";"x 160")))',
      },
      {
        codigo: '4000-Ad',
        descripcion: 'Modelo 4000 Ad',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VAN0/2)-8',
        bpu1: '(VAN0/2)+37',
        hkit: 'SI(ALT1>1600;900;700) =SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-250-1;SI(ALT1>1600;"x 200";"x 160")))',
      },
      {
        codigo: '4000-Bi',
        descripcion: 'Modelo 4000 Bi',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VAN0/3)+3',
        bpu1: '(VAN0/3)+48',
        hkit: 'SI(ALT1>1600;900;700) =SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-250-1;SI(ALT1>1600;"x 200";"x 160")))',
      },
      {
        codigo: '4000-Bd',
        descripcion: 'Modelo 4000 Bd',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VAN0/3)+3',
        bpu1: '(VAN0/3)+48',
        hkit: 'SI(ALT1>1600;900;700) =SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-250-1;SI(ALT1>1600;"x 200";"x 160")))',
      },
      {
        codigo: '4000-Ci',
        descripcion: 'Modelo 4000 Ci',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VANO-PAF1)/2)+5',
        bpu1: '((VANO-PAF1)/2)+48',
        hkit: 'SI(ALT1>1600;900;700) =SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-250-1;SI(ALT1>1600;"x 200";"x 160")))',
      },
      {
        codigo: '4000-Cd',
        descripcion: 'Modelo 4000 Cd',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: 'PAF1-8',
        bpf2: '((VANO-PAF1)/2)+5',
        bpu1: '((VANO-PAF1)/2)+48',
        hkit: 'SI(ALT1>1600;900;700) =SI(VAN0>2000;BF-250-1;SI(VAN0>1600;BF-250-1;SI(ALT1>1600;"x 200";"x 160")))',
      },
      {
        codigo: '4000-D',
        descripcion: 'Modelo 4000 D',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VAN0/4)+8',
        bpf2: '(VAN0/4)+4',
        bpu1: '(VAN0/4)+39',
        hkit: 'SI(ALT1>1600;900;700) =SI(VAN0>2000;BF-250-2;SI(VAN0>1600;BF-250-2;SI(ALT1>1600;"x 200";"x 160")))',
      },
      {
        codigo: '4100',
        descripcion: 'Modelo 4100',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VANO1/2)-32',
        bpf2: '(VANO2/2)-32',
        bpf4: '(VANO2/2)+33',
        bpu1: '(VANO1/2)+33',
        hkit: 'SI(ALT1>1600;900;700) =SI((VANO1+VANO2)>2400;BF-250-2;SI(ALT1>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-A1i',
        descripcion: 'Modelo 4200 A1i',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VANO1/2)-5',
        bpf2: 'VANO2-33',
        bpu1: '(VANO1/2)+26',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-A1d',
        descripcion: 'Modelo 4200 A1d',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VANO1/2)-5',
        bpf2: 'VANO2-33',
        bpu1: '(VANO1/2)+26',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-A2i',
        descripcion: 'Modelo 4200 A2i',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VANO1/2)-19',
        bpf2: 'VANO2-36',
        bpu1: '(VANO1/2)+26',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-A2d',
        descripcion: 'Modelo 4200 A2d',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VANO1/2)-19',
        bpf2: 'VANO2-36',
        bpu1: '(VANO1/2)+26',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-Bi',
        descripcion: 'Modelo 4200 Bi',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VANO1/3)+15',
        bpf2: '(VANO1/3)-7',
        bpf3: 'VANO2-33',
        bpu1: '(VANO1/3)+38',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-Bd',
        descripcion: 'Modelo 4200 Bd',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VANO1/3)+15',
        bpf2: '(VANO1/3)-7',
        bpf3: 'VANO2-33',
        bpu1: '(VANO1/3)+38',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-Ci',
        descripcion: 'Modelo 4200 Ci',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: 'PAF1-8',
        bpf2: '((VANO1-PAF1)/2)+12',
        bpf3: 'VANO2-33',
        bpu1: '((VANO1-PAF1)/2)+33',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-C1d',
        descripcion: 'Modelo 4200 C1d',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: 'PAF1-8',
        bpf2: '((VANO1-PAF1)/2)+12',
        bpf3: 'VANO2-33',
        bpu1: '((VANO1-PAF1)/2)+33',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-C2i',
        descripcion: 'Modelo 4200 C2i',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: 'PAF1-16',
        bpf2: '((VANO1-PAF1)/2',
        bpf3: 'VANO2-33',
        bpu1: '((VANO1-PAF1)/2)+44',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-C2d',
        descripcion: 'Modelo 4200 C2d',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: 'PAF1-16',
        bpf2: '((VANO1-PAF1)/2',
        bpf3: 'VANO2-33',
        bpu1: '((VANO1-PAF1)/2)+44',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
      {
        codigo: '4200-D',
        descripcion: 'Modelo 4200 D',
        hpf1: 'ALT1-65',
        hpf2: 'ALT1-25',
        bpf1: '(VANO1/4)+8',
        bpf2: '(VANO1/4)+4',
        bpf3: 'VANO2-33',
        bpu1: '(VANO1/4)+31',
        hkit: 'SI(ALT1>1600;900;700) =SI(VANO1>2000,BA-250;(SI(VAN01>1600;"x 200";"x 160"))',
      },
    ];

    const modelosCreados: Modelo[] = [];
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
      modelosCreados.push(modelo);
    }

    // 4. Comprobantes
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

    // 5. Vidrios
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

    // 6. Herrajes
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

    // 7. Servicios
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

    // 8. Accesorios
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
    console.log(`   • ${modelos.length} Modelos con fórmulas`);
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
