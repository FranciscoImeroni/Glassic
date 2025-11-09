import { API_URL } from './config';

// ==================== TIPOS ====================

export interface Comprobante {
  id: string;
  codigo: string;
  descripcion?: string;
}

export interface Vidrio {
  id: string;
  tipo?: string;
  color?: string;
}

export interface Servicio {
  id: string;
  nombre: string;
}

export interface Herraje {
  id: string;
  color: string;
}

export interface Accesorio {
  id: string;
  descripcion: string;
}

export interface Variable {
  id: string;
  codigo: string;
  nombre: string;
}

export interface CodigoInstruccion {
  id: string;
  codigo: string;
  instruccion: string;
}

export interface Producto {
  id: string;
  linea: string;
  serie: string;
  modelo: string;
  varVi: string;
  codIvi: string;
  espVidrio: number;
  imagen?: string;
  esquema?: string;
  plano?: string;
  variables?: Variable[];
  instrucciones?: CodigoInstruccion[];
}

// ==================== COMPROBANTES ====================

export async function getComprobantes(): Promise<Comprobante[]> {
  const res = await fetch(`${API_URL}/comprobantes`);
  if (!res.ok) throw new Error('Error al obtener comprobantes');
  return res.json();
}

export async function createComprobante(data: Omit<Comprobante, 'id'>): Promise<Comprobante> {
  const res = await fetch(`${API_URL}/comprobantes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear comprobante');
  return res.json();
}

// ==================== VIDRIOS ====================

export async function getVidrios(): Promise<Vidrio[]> {
  const res = await fetch(`${API_URL}/vidrios`);
  if (!res.ok) throw new Error('Error al obtener vidrios');
  return res.json();
}

export async function createVidrio(data: Omit<Vidrio, 'id'>): Promise<Vidrio> {
  const res = await fetch(`${API_URL}/vidrios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear vidrio');
  return res.json();
}

// ==================== SERVICIOS ====================

export async function getServicios(): Promise<Servicio[]> {
  const res = await fetch(`${API_URL}/servicios`);
  if (!res.ok) throw new Error('Error al obtener servicios');
  return res.json();
}

export async function createServicio(data: Omit<Servicio, 'id'>): Promise<Servicio> {
  const res = await fetch(`${API_URL}/servicios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear servicio');
  return res.json();
}

// ==================== HERRAJES ====================

export async function getHerrajes(): Promise<Herraje[]> {
  const res = await fetch(`${API_URL}/herrajes`);
  if (!res.ok) throw new Error('Error al obtener herrajes');
  return res.json();
}

export async function createHerraje(data: Omit<Herraje, 'id'>): Promise<Herraje> {
  const res = await fetch(`${API_URL}/herrajes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear herraje');
  return res.json();
}

// ==================== ACCESORIOS ====================

export async function getAccesorios(): Promise<Accesorio[]> {
  const res = await fetch(`${API_URL}/accesorios`);
  if (!res.ok) throw new Error('Error al obtener accesorios');
  return res.json();
}

export async function createAccesorio(data: Omit<Accesorio, 'id'>): Promise<Accesorio> {
  const res = await fetch(`${API_URL}/accesorios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear accesorio');
  return res.json();
}

// ==================== VARIABLES ====================

export async function getVariables(): Promise<Variable[]> {
  const res = await fetch(`${API_URL}/variables`);
  if (!res.ok) throw new Error('Error al obtener variables');
  return res.json();
}

export async function createVariable(data: Omit<Variable, 'id'>): Promise<Variable> {
  const res = await fetch(`${API_URL}/variables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear variable');
  return res.json();
}

// ==================== CÓDIGOS DE INSTRUCCIÓN ====================

export async function getCodigosInstruccion(): Promise<CodigoInstruccion[]> {
  const res = await fetch(`${API_URL}/codigos-instruccion`);
  if (!res.ok) throw new Error('Error al obtener códigos de instrucción');
  return res.json();
}

export async function createCodigoInstruccion(data: Omit<CodigoInstruccion, 'id'>): Promise<CodigoInstruccion> {
  const res = await fetch(`${API_URL}/codigos-instruccion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear código de instrucción');
  return res.json();
}

// ==================== PRODUCTOS ====================

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

export async function createProducto(data: Omit<Producto, 'id'>): Promise<Producto> {
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear producto');
  return res.json();
}

// ==================== HELPERS ====================

// Obtener tipos únicos de vidrios
export async function getTiposVidrio(): Promise<string[]> {
  const vidrios = await getVidrios();
  const tipos = [...new Set(vidrios.map(v => v.tipo).filter(Boolean))];
  return tipos as string[];
}

// Obtener colores únicos de vidrios
export async function getColoresVidrio(): Promise<string[]> {
  const vidrios = await getVidrios();
  const colores = [...new Set(vidrios.map(v => v.color).filter(Boolean))];
  return colores as string[];
}

// Obtener líneas únicas de productos
export async function getLineasProductos(): Promise<string[]> {
  const productos = await getProductos();
  const lineas = [...new Set(productos.map(p => p.linea))];
  return lineas;
}

// Obtener series únicas de productos
export async function getSeriesProductos(): Promise<string[]> {
  const productos = await getProductos();
  const series = [...new Set(productos.map(p => p.serie))];
  return series;
}

// Obtener modelos únicos de productos
export async function getModelosProductos(): Promise<string[]> {
  const productos = await getProductos();
  const modelos = [...new Set(productos.map(p => p.modelo))];
  return modelos;
}

// Obtener espesores únicos de vidrio
export async function getEspesoresVidrio(): Promise<number[]> {
  const productos = await getProductos();
  const espesores = [...new Set(productos.map(p => p.espVidrio))];
  return espesores.sort((a, b) => a - b);
}
