import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ProductosService } from '../productos/productos.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productosService: ProductosService,
  ) {}

  /**
   * Endpoint de prueba para verificar URLs de Cloudinary
   * GET /cloudinary/test-url?publicId=IM-4200-D
   */
  @Get('test-url')
  testUrl(@Query('publicId') publicId: string) {
    if (!publicId) {
      return {
        error: 'Debe proporcionar un publicId',
        ejemplo: '/cloudinary/test-url?publicId=IM-4200-D',
      };
    }

    // Generar URL sin carpeta (buscar en la raíz)
    const url = this.cloudinaryService.getCloudinary().url(publicId, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      publicId,
      url,
      cloudName: this.cloudinaryService.getCloudinary().config().cloud_name,
      mensaje: 'Prueba esta URL en tu navegador para ver si la imagen carga',
    };
  }

  /**
   * Endpoint para probar con diferentes variaciones de nombre
   * GET /cloudinary/test-variations?nombre=4200-D
   */
  @Get('test-variations')
  testVariations(@Query('nombre') nombre: string) {
    if (!nombre) {
      return {
        error: 'Debe proporcionar un nombre',
        ejemplo: '/cloudinary/test-variations?nombre=4200-D',
      };
    }

    const variations = [
      // Sin prefijo, sin extensión
      this.cloudinaryService.getCloudinary().url(nombre, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
      // Con prefijo IM-, sin extensión
      this.cloudinaryService.getCloudinary().url(`IM-${nombre}`, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
      // Con prefijo IM-, con extensión .jpg
      this.cloudinaryService.getCloudinary().url(`IM-${nombre}.jpg`, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
      // En carpeta Imagenes con prefijo
      this.cloudinaryService.getCloudinary().url(`Imagenes/IM-${nombre}`, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
      // En carpeta Imagenes con prefijo y extensión
      this.cloudinaryService.getCloudinary().url(`Imagenes/IM-${nombre}.jpg`, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
    ];

    return {
      nombre,
      mensaje: 'Prueba estas URLs en tu navegador. Una de ellas debería funcionar.',
      urls: {
        'solo_nombre': variations[0],
        'con_prefijo_IM': variations[1],
        'con_prefijo_IM_y_jpg': variations[2],
        'carpeta_Imagenes_con_prefijo': variations[3],
        'carpeta_Imagenes_con_prefijo_y_jpg': variations[4],
      },
    };
  }

  /**
   * Endpoint para probar ORDEN_DE_FABRICACION
   * GET /cloudinary/test-orden
   */
  @Get('test-orden')
  testOrden() {
    const cloudConfig = this.cloudinaryService.getCloudinary().config();

    const variations = [
      this.cloudinaryService.getCloudinary().url('ORDEN_DE_FABRICACION', {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
      this.cloudinaryService.getCloudinary().url('ORDEN_DE_FABRICACION.jpg', {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
    ];

    return {
      mensaje: 'Prueba estas URLs para ORDEN_DE_FABRICACION',
      cloudName: cloudConfig.cloud_name,
      urls: {
        'sin_extension': variations[0],
        'con_extension_jpg': variations[1],
      },
    };
  }

  /**
   * Endpoint de diagnóstico - verifica la configuración de Cloudinary
   * GET /cloudinary/diagnostico
   */
  @Get('diagnostico')
  diagnostico() {
    const cloudConfig = this.cloudinaryService.getCloudinary().config();

    return {
      configuracion: {
        cloud_name: cloudConfig.cloud_name || 'NO CONFIGURADO',
        api_key: cloudConfig.api_key ? `${cloudConfig.api_key.substring(0, 4)}...` : 'NO CONFIGURADO',
        api_secret_configurado: !!cloudConfig.api_secret,
      },
      url_ejemplo_ORDEN_DE_FABRICACION: this.cloudinaryService.getCloudinary().url('ORDEN_DE_FABRICACION', {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
      }),
      instrucciones: 'Si cloud_name es "NO CONFIGURADO" o "your_cloud_name", las variables de entorno no están configuradas en Railway',
    };
  }

  /**
   * Endpoint para subir imágenes en bulk
   * POST /cloudinary/bulk-upload
   * Acepta múltiples archivos JPG, parsea nombres de archivo (ej: IM-4200-A2d.jpg)
   * y asocia las imágenes con productos en la BD
   */
  @Post('bulk-upload')
  @UseInterceptors(FilesInterceptor('files'))
  async bulkUpload(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{
    success: number;
    failed: number;
    errors: Array<{ fileName: string; reason: string }>;
  }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se proporcionaron archivos');
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: Array<{ fileName: string; reason: string }> = [];

    for (const file of files) {
      try {
        const fileName = file.originalname;

        // Parsear el nombre del archivo (ej: "IM-4200-A2d.jpg" → prefix="IM", modelo="4200-A2d")
        const nameWithoutExt = fileName.replace(/\.(jpg|jpeg|png)$/i, '');
        const parts = nameWithoutExt.split('-');

        if (parts.length < 2) {
          errors.push({
            fileName,
            reason: 'Formato de nombre inválido (debe ser PREFIJO-MODELO, ej: IM-4200-A2d.jpg)',
          });
          failedCount++;
          continue;
        }

        const prefix = parts[0]; // IM, ES, o PL
        const modelo = parts.slice(1).join('-'); // 4200-A2d

        // Validar prefijo
        if (!['IM', 'ES', 'PL'].includes(prefix)) {
          errors.push({
            fileName,
            reason: `Prefijo "${prefix}" inválido (debe ser IM, ES, o PL)`,
          });
          failedCount++;
          continue;
        }

        // Buscar o crear producto por modelo
        const producto = await this.productosService.findOrCreateByModelo(modelo);

        // Subir imagen a Cloudinary con public_id fijo (sin sufijos)
        const publicId = nameWithoutExt; // ej: "IM-4200-A2d"
        const uploadResult = await this.cloudinaryService.uploadImage(
          file.buffer,
          publicId,
        );

        // Actualizar el campo correspondiente según el prefijo
        switch (prefix) {
          case 'IM':
            producto.imagenCloudinaryId = uploadResult.publicId;
            break;
          case 'ES':
            producto.esquemaCloudinaryId = uploadResult.publicId;
            break;
          case 'PL':
            producto.planoCloudinaryId = uploadResult.publicId;
            break;
        }

        // Guardar producto con el nuevo cloudinary_id
        await this.productosService.update(producto.id, {
          imagenCloudinaryId: producto.imagenCloudinaryId,
          esquemaCloudinaryId: producto.esquemaCloudinaryId,
          planoCloudinaryId: producto.planoCloudinaryId,
        });

        successCount++;
      } catch (error) {
        failedCount++;
        errors.push({
          fileName: file.originalname,
          reason: error.message || 'Error desconocido',
        });
      }
    }

    return {
      success: successCount,
      failed: failedCount,
      errors,
    };
  }
}
