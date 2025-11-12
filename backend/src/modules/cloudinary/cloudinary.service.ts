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
   * IMPORTANTE: Espera que en BD esté sin prefijo (ej: "4200-C2i")
   * Agrega prefijo IM- para buscar en Cloudinary (ej: "IM-4200-C2i")
   * @param modeloNombre - Nombre del modelo SIN prefijo (ej: 4200-C2i)
   * @returns URL de la imagen del modelo
   */
  getModeloImageUrl(modeloNombre: string): string {
    // Agregar prefijo IM- porque en BD está sin prefijo
    const imageFileName = `IM-${modeloNombre}`;
    return cloudinary.url(imageFileName, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  /**
   * Obtiene la URL de un esquema
   * IMPORTANTE: Espera que en BD esté sin prefijo (ej: "4200-C2i")
   * Agrega prefijo ES- para buscar en Cloudinary (ej: "ES-4200-C2i")
   * @param esquemaNombre - Nombre del esquema SIN prefijo (ej: 4200-C2i)
   * @returns URL del esquema
   */
  getEsquemaUrl(esquemaNombre: string): string {
    // Agregar prefijo ES- porque en BD está sin prefijo
    const esquemaFileName = `ES-${esquemaNombre}`;
    return cloudinary.url(esquemaFileName, {
      secure: true,
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  /**
   * Obtiene la URL de un plano
   * IMPORTANTE: Espera que en BD esté sin prefijo (ej: "4200C2d")
   * Agrega prefijo PL- para buscar en Cloudinary (ej: "PL-4200C2d")
   * @param planoNombre - Nombre del plano SIN prefijo (ej: 4200C2d)
   * @returns URL del plano
   */
  getPlanoUrl(planoNombre: string): string {
    // Agregar prefijo PL- porque en BD está sin prefijo
    const planoFileName = `PL-${planoNombre}`;
    return cloudinary.url(planoFileName, {
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

  /**
   * Sube una imagen a Cloudinary
   * @param file - Buffer del archivo
   * @param publicId - Public ID para la imagen (ej: "IM-4200-A2d")
   * @returns Resultado del upload con URL y public_id
   */
  async uploadImage(
    file: Buffer,
    publicId: string,
  ): Promise<{ publicId: string; url: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          overwrite: true, // Sobrescribir si ya existe
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              publicId: result.public_id,
              url: result.secure_url,
            });
          } else {
            reject(new Error('Upload completado pero sin resultado'));
          }
        },
      );

      uploadStream.end(file);
    });
  }
}
