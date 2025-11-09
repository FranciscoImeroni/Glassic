import { Controller, Get, Query } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

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
      urls: {
        'sin_extension': variations[0],
        'con_extension_jpg': variations[1],
      },
    };
  }
}
