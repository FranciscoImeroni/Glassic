/**
 * Utilidades para construir URLs de Cloudinary
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmshentls';

/**
 * Construye una URL de Cloudinary para una imagen
 * @param folder - Carpeta en Cloudinary (esquemas, imagenes, planos)
 * @param publicId - Nombre del archivo/imagen (sin extensión)
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
 * @param modeloNombre - Nombre del modelo
 * @param options - Opciones de transformación
 * @returns URL de la imagen del modelo
 */
export function getModeloImageUrl(
  modeloNombre: string,
  options?: { width?: number; height?: number }
): string {
  return getCloudinaryUrl('imagenes', modeloNombre, options);
}

/**
 * Obtiene la URL de un esquema
 * @param esquemaNombre - Nombre del esquema
 * @param options - Opciones de transformación
 * @returns URL del esquema
 */
export function getEsquemaUrl(
  esquemaNombre: string,
  options?: { width?: number; height?: number }
): string {
  return getCloudinaryUrl('esquemas', esquemaNombre, options);
}

/**
 * Obtiene la URL de un plano
 * @param planoNombre - Nombre del plano
 * @param options - Opciones de transformación
 * @returns URL del plano
 */
export function getPlanoUrl(
  planoNombre: string,
  options?: { width?: number; height?: number }
): string {
  return getCloudinaryUrl('planos', planoNombre, options);
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

  // La imagen está en la raíz de Cloudinary
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/ORDEN_DE_FABRICACION`;
}
