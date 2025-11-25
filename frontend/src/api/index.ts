import { API_URL } from './config';

// ==================== TIPOS ====================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

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

export interface Modelo {
  id: string;
  codigo: string;
  descripcion: string;
  // Columnas de fórmulas
  hpf1?: string;
  hpf2?: string;
  hpue?: string;
  bpf1?: string;
  bpf2?: string;
  bpf3?: string;
  bpf4?: string;
  bpu1?: string;
  bp2?: string;
  debi?: string;
  htir?: string;
  ckit?: string;
  hkit?: string;
}

export interface ValorFijo {
  id: string;
  codigo: string;
  descripcion: string;
  valorMm: number;
}

export interface Kit {
  id: string;
  codigo: string;
  serieMampara: string;
  nombreKit: string;
}

// ==================== COMPROBANTES ====================

export async function getComprobantes(): Promise<Comprobante[]> {
  const res = await fetch(`${API_URL}/comprobantes`);
  if (!res.ok) throw new Error('Error al obtener comprobantes');
  return res.json();
}

export async function getComprobantesPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Comprobante>> {
  const res = await fetch(`${API_URL}/comprobantes?page=${page}&limit=${limit}`);
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

export async function getVidriosPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Vidrio>> {
  const res = await fetch(`${API_URL}/vidrios?page=${page}&limit=${limit}`);
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

export async function updateVidrio(id: string, data: Partial<Omit<Vidrio, 'id'>>): Promise<Vidrio> {
  const res = await fetch(`${API_URL}/vidrios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar vidrio');
  return res.json();
}

export async function deleteVidrio(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/vidrios/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar vidrio');
}

// ==================== SERVICIOS ====================

export async function getServicios(): Promise<Servicio[]> {
  const res = await fetch(`${API_URL}/servicios`);
  if (!res.ok) throw new Error('Error al obtener servicios');
  return res.json();
}

export async function getServiciosPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Servicio>> {
  const res = await fetch(`${API_URL}/servicios?page=${page}&limit=${limit}`);
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

export async function updateServicio(id: string, data: Partial<Omit<Servicio, 'id'>>): Promise<Servicio> {
  const res = await fetch(`${API_URL}/servicios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar servicio');
  return res.json();
}

export async function deleteServicio(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/servicios/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar servicio');
}

// ==================== HERRAJES ====================

export async function getHerrajes(): Promise<Herraje[]> {
  const res = await fetch(`${API_URL}/herrajes`);
  if (!res.ok) throw new Error('Error al obtener herrajes');
  return res.json();
}

export async function getHerrajesPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Herraje>> {
  const res = await fetch(`${API_URL}/herrajes?page=${page}&limit=${limit}`);
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

export async function updateHerraje(id: string, data: Partial<Omit<Herraje, 'id'>>): Promise<Herraje> {
  const res = await fetch(`${API_URL}/herrajes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar herraje');
  return res.json();
}

export async function deleteHerraje(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/herrajes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar herraje');
}

// ==================== ACCESORIOS ====================

export async function getAccesorios(): Promise<Accesorio[]> {
  const res = await fetch(`${API_URL}/accesorios`);
  if (!res.ok) throw new Error('Error al obtener accesorios');
  return res.json();
}

export async function getAccesoriosPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Accesorio>> {
  const res = await fetch(`${API_URL}/accesorios?page=${page}&limit=${limit}`);
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

export async function updateAccesorio(id: string, data: Partial<Omit<Accesorio, 'id'>>): Promise<Accesorio> {
  const res = await fetch(`${API_URL}/accesorios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar accesorio');
  return res.json();
}

export async function deleteAccesorio(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/accesorios/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar accesorio');
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

export async function getProductosPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Producto>> {
  const res = await fetch(`${API_URL}/productos?page=${page}&limit=${limit}`);
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

export async function updateProducto(id: string, data: Partial<Omit<Producto, 'id'>>): Promise<Producto> {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar producto');
  return res.json();
}

export async function deleteProducto(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar producto');
}

// ==================== MODELOS (FÓRMULAS) ====================

export async function getModelos(): Promise<Modelo[]> {
  const res = await fetch(`${API_URL}/formulas/modelos`);
  if (!res.ok) throw new Error('Error al obtener modelos');
  return res.json();
}

export async function getModelosPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Modelo>> {
  const res = await fetch(`${API_URL}/formulas/modelos?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Error al obtener modelos');
  return res.json();
}

export async function createModelo(data: Omit<Modelo, 'id'>): Promise<Modelo> {
  const res = await fetch(`${API_URL}/formulas/modelos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear modelo');
  return res.json();
}

export async function updateModelo(id: string, data: Partial<Omit<Modelo, 'id'>>): Promise<Modelo> {
  const res = await fetch(`${API_URL}/formulas/modelos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar modelo');
  return res.json();
}

export async function deleteModelo(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/formulas/modelos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar modelo');
}

// ==================== VARIABLES CALCULADAS ====================
// NOTA: Eliminadas tras refactorización - las fórmulas ahora están integradas en los modelos

// ==================== FÓRMULAS CALCULADAS ====================
// NOTA: Eliminadas tras refactorización - las fórmulas ahora están integradas en los modelos

// ==================== VALORES FIJOS ====================

export async function getValoresFijos(): Promise<ValorFijo[]> {
  const res = await fetch(`${API_URL}/configuracion/valores-fijos`);
  if (!res.ok) throw new Error('Error al obtener valores fijos');
  return res.json();
}

export async function getValoresFijosPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<ValorFijo>> {
  const res = await fetch(`${API_URL}/configuracion/valores-fijos?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Error al obtener valores fijos');
  return res.json();
}

export async function createValorFijo(data: Omit<ValorFijo, 'id'>): Promise<ValorFijo> {
  const res = await fetch(`${API_URL}/configuracion/valores-fijos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear valor fijo');
  return res.json();
}

export async function updateValorFijo(id: string, data: Partial<Omit<ValorFijo, 'id'>>): Promise<ValorFijo> {
  const res = await fetch(`${API_URL}/configuracion/valores-fijos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar valor fijo');
  return res.json();
}

export async function deleteValorFijo(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/configuracion/valores-fijos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar valor fijo');
}

// ==================== KITS ====================

export async function getKits(): Promise<Kit[]> {
  const res = await fetch(`${API_URL}/configuracion/kits`);
  if (!res.ok) throw new Error('Error al obtener kits');
  return res.json();
}

export async function getKitsPaginated(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Kit>> {
  const res = await fetch(`${API_URL}/configuracion/kits?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Error al obtener kits');
  return res.json();
}

export async function createKit(data: Omit<Kit, 'id'>): Promise<Kit> {
  const res = await fetch(`${API_URL}/configuracion/kits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear kit');
  return res.json();
}

export async function updateKit(id: string, data: Partial<Omit<Kit, 'id'>>): Promise<Kit> {
  const res = await fetch(`${API_URL}/configuracion/kits/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar kit');
  return res.json();
}

export async function deleteKit(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/configuracion/kits/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar kit');
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
