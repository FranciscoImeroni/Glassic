/**
 * Utilidades para construir URLs de Cloudinary
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmqbjlqqb';

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
 * Busca directamente el nombre sin agregar prefijos (las imágenes ya tienen IM-)
 * @param modeloNombre - Nombre del modelo con prefijo (ej: IM-4200-D)
 * @param options - Opciones de transformación
 * @returns URL de la imagen del modelo
 */
export function getModeloImageUrl(
  modeloNombre: string,
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

  // Usar el nombre tal cual (ya tiene el prefijo IM-)
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${modeloNombre}`;
}

/**
 * Obtiene la URL de un esquema
 * Busca directamente el nombre sin agregar prefijos (las imágenes ya tienen ES-)
 * @param esquemaNombre - Nombre del esquema con prefijo (ej: ES-4200-D)
 * @param options - Opciones de transformación
 * @returns URL del esquema
 */
export function getEsquemaUrl(
  esquemaNombre: string,
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

  // Usar el nombre tal cual (ya tiene el prefijo ES-)
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${esquemaNombre}`;
}

/**
 * Obtiene la URL de un plano
 * Busca directamente el nombre sin agregar prefijos (las imágenes ya tienen PL-)
 * @param planoNombre - Nombre del plano con prefijo (ej: PL-4200C2d)
 * @param options - Opciones de transformación
 * @returns URL del plano
 */
export function getPlanoUrl(
  planoNombre: string,
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

  // Usar el nombre tal cual (ya tiene el prefijo PL-)
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${planoNombre}`;
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

  // Buscar en la raíz de Cloudinary
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/ORDEN_DE_FABRICACION`;
}
