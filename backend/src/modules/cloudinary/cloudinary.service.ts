import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  getCloudinary() {
    return cloudinary;
  }

  /**
   * Construye una URL de Cloudinary para una imagen
   * @param folder - Carpeta en Cloudinary (Esquemas, Imagenes, Planos)
   * @param publicId - Nombre del archivo/imagen con extensión
   * @returns URL completa de la imagen
   */
  getImageUrl(folder: string, publicId: string): string {
    return cloudinary.url(`${folder}/${publicId}`, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  /**
   * Obtiene la URL de la imagen de un modelo
   * @param modeloNombre - Nombre del modelo (ej: 4200-D)
   * @returns URL de la imagen del modelo
   */
  getModeloImageUrl(modeloNombre: string): string {
    const imageFileName = `IM-${modeloNombre}.jpg`;
    return this.getImageUrl('Imagenes', imageFileName);
  }

  /**
   * Obtiene la URL de un esquema
   * @param esquemaNombre - Nombre del esquema (ej: 4200-D)
   * @returns URL del esquema
   */
  getEsquemaUrl(esquemaNombre: string): string {
    const esquemaFileName = `ES-${esquemaNombre}.jpg`;
    return this.getImageUrl('Esquemas', esquemaFileName);
  }

  /**
   * Obtiene la URL de un plano
   * @param planoNombre - Nombre del plano (ej: 4200C2d)
   * @returns URL del plano
   */
  getPlanoUrl(planoNombre: string): string {
    const planoFileName = `PL-${planoNombre}.jpg`;
    return this.getImageUrl('Planos', planoFileName);
  }

  /**
   * Obtiene la URL de la imagen ORDEN_DE_FABRICACION
   * @returns URL de la imagen de orden de fabricación
   */
  getOrdenFabricacionUrl(): string {
    // La imagen suelta está en la raíz de Cloudinary con extensión .jpg
    return cloudinary.url('ORDEN_DE_FABRICACION.jpg', {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
  }
}
