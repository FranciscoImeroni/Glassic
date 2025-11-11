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
   * Busca directamente el nombre sin agregar prefijos (las imágenes ya tienen IM-)
   * @param modeloNombre - Nombre del modelo con prefijo (ej: IM-4200-D)
   * @returns URL de la imagen del modelo
   */
  getModeloImageUrl(modeloNombre: string): string {
    // Usar el nombre tal cual (ya tiene el prefijo IM-)
    return cloudinary.url(modeloNombre, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  /**
   * Obtiene la URL de un esquema
   * Busca directamente el nombre sin agregar prefijos (las imágenes ya tienen ES-)
   * @param esquemaNombre - Nombre del esquema con prefijo (ej: ES-4200-D)
   * @returns URL del esquema
   */
  getEsquemaUrl(esquemaNombre: string): string {
    // Usar el nombre tal cual (ya tiene el prefijo ES-)
    return cloudinary.url(esquemaNombre, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  /**
   * Obtiene la URL de un plano
   * Busca directamente el nombre sin agregar prefijos (las imágenes ya tienen PL-)
   * @param planoNombre - Nombre del plano con prefijo (ej: PL-4200C2d)
   * @returns URL del plano
   */
  getPlanoUrl(planoNombre: string): string {
    // Usar el nombre tal cual (ya tiene el prefijo PL-)
    return cloudinary.url(planoNombre, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  /**
   * Obtiene la URL de la imagen ORDEN_DE_FABRICACION
   * @returns URL de la imagen de orden de fabricación
   */
  getOrdenFabricacionUrl(): string {
    // Buscar en la raíz de Cloudinary
    return cloudinary.url('ORDEN_DE_FABRICACION', {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
  }
}
