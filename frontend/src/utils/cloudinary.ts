/**
 * Utilidades para construir URLs de Cloudinary
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';

/**
 * Construye una URL de Cloudinary para una imagen
 * @param folder - Carpeta en Cloudinary (Esquemas, Imagenes, Planos)
 * @param publicId - Nombre del archivo/imagen con extensión (ej: IM-4200-D.jpg)
 * @param options - Opciones adicionales para la URL
 * @returns URL completa de la imagen
 */
export function getCloudinaryUrl(
  folder: string,
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options;

  let transformations = `q_${quality},f_${format}`;

  if (width) {
    transformations += `,w_${width}`;
  }

  if (height) {
    transformations += `,h_${height}`;
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${folder}/${publicId}`;
}

/**
 * Obtiene la URL de la imagen de un modelo
 * @param modeloNombre - Nombre del modelo (ej: 4200-D)
 * @param options - Opciones de transformación
 * @returns URL de la imagen del modelo
 */
export function getModeloImageUrl(
  modeloNombre: string,
  options?: { width?: number; height?: number }
): string {
  // Agregar prefijo IM- y extensión .jpg
  const imageFileName = `IM-${modeloNombre}.jpg`;
  return getCloudinaryUrl('Imagenes', imageFileName, options);
}

/**
 * Obtiene la URL de un esquema
 * @param esquemaNombre - Nombre del esquema (ej: 4200-D)
 * @param options - Opciones de transformación
 * @returns URL del esquema
 */
export function getEsquemaUrl(
  esquemaNombre: string,
  options?: { width?: number; height?: number }
): string {
  // Agregar prefijo ES- y extensión .jpg
  const esquemaFileName = `ES-${esquemaNombre}.jpg`;
  return getCloudinaryUrl('Esquemas', esquemaFileName, options);
}

/**
 * Obtiene la URL de un plano
 * @param planoNombre - Nombre del plano (ej: 4200C2d)
 * @param options - Opciones de transformación
 * @returns URL del plano
 */
export function getPlanoUrl(
  planoNombre: string,
  options?: { width?: number; height?: number }
): string {
  // Agregar prefijo PL- y extensión .jpg
  const planoFileName = `PL-${planoNombre}.jpg`;
  return getCloudinaryUrl('Planos', planoFileName, options);
}

/**
 * Obtiene la URL de la imagen ORDEN_DE_FABRICACION
 * @param options - Opciones de transformación
 * @returns URL de la imagen de orden de fabricación
 */
export function getOrdenFabricacionUrl(
  options?: { width?: number; height?: number; quality?: string; format?: string }
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options || {};

  let transformations = `q_${quality},f_${format}`;

  if (width) {
    transformations += `,w_${width}`;
  }

  if (height) {
    transformations += `,h_${height}`;
  }

  // La imagen está en la raíz de Cloudinary con extensión .jpg
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/ORDEN_DE_FABRICACION.jpg`;
}
