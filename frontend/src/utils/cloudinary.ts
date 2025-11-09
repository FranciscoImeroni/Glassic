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
 * Busca en la raíz de Cloudinary (sin carpeta) con el prefijo IM-
 * @param modeloNombre - Nombre del modelo (ej: 4200-D)
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

  // Buscar en la raíz sin carpeta, solo con prefijo IM-
  const imageFileName = `IM-${modeloNombre}`;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${imageFileName}`;
}

/**
 * Obtiene la URL de un esquema
 * Busca en la raíz de Cloudinary (sin carpeta) con el prefijo ES-
 * @param esquemaNombre - Nombre del esquema (ej: 4200-D)
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

  // Buscar en la raíz sin carpeta, solo con prefijo ES-
  const esquemaFileName = `ES-${esquemaNombre}`;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${esquemaFileName}`;
}

/**
 * Obtiene la URL de un plano
 * Busca en la raíz de Cloudinary (sin carpeta) con el prefijo PL-
 * @param planoNombre - Nombre del plano (ej: 4200C2d)
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

  // Buscar en la raíz sin carpeta, solo con prefijo PL-
  const planoFileName = `PL-${planoNombre}`;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${planoFileName}`;
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
