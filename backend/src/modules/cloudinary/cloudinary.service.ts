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
   * @param folder - Carpeta en Cloudinary (esquemas, imagenes, planos)
   * @param publicId - Nombre del archivo/imagen
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
   * @param modeloNombre - Nombre del modelo
   * @returns URL de la imagen del modelo
   */
  getModeloImageUrl(modeloNombre: string): string {
    return this.getImageUrl('imagenes', modeloNombre);
  }

  /**
   * Obtiene la URL de un esquema
   * @param esquemaNombre - Nombre del esquema
   * @returns URL del esquema
   */
  getEsquemaUrl(esquemaNombre: string): string {
    return this.getImageUrl('esquemas', esquemaNombre);
  }

  /**
   * Obtiene la URL de un plano
   * @param planoNombre - Nombre del plano
   * @returns URL del plano
   */
  getPlanoUrl(planoNombre: string): string {
    return this.getImageUrl('planos', planoNombre);
  }

  /**
   * Obtiene la URL de la imagen ORDEN_DE_FABRICACION
   * @returns URL de la imagen de orden de fabricación
   */
  getOrdenFabricacionUrl(): string {
    // La imagen suelta está en la raíz de Cloudinary
    return cloudinary.url('ORDEN_DE_FABRICACION', {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
  }
}
