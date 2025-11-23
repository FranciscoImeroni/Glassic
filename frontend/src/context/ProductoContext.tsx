import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Tipos
interface Variable {
  id: string;
  codigo: string;
  nombre: string;
}

interface DatosCliente {
  cliente: string;
  referencia: string;
  obra: string;
  comprobanteId: string;
  numeroComprobante: string;
  fecha: string;
  vidrioId: string;
  servicioId: string;
  herrajeId: string;
  accesorios: Array<{ cantidad: number; descripcion: string }>;
  notas: string;
}

interface ProductoContextType {
  // Producto seleccionado
  lineaSeleccionada: string | null;
  serieSeleccionada: string | null;
  modeloSeleccionado: string | null;
  productoId: string | null;
  modeloId: number | null;

  // Variables y valores
  variablesEntrada: Variable[];
  valoresEntrada: Record<string, number>;
  valoresCalculados: Record<string, number | string>;

  // Datos del cliente
  datosCliente: DatosCliente;

  // URLs de imágenes
  imagenModeloUrl: string | null;
  planoUrl: string | null;
  esquemaUrl: string | null;

  // Métodos
  setProducto: (linea: string, serie: string, modelo: string, productoId: string, modeloId: number) => void;
  setVariablesEntrada: (variables: Variable[]) => void;
  setValoresEntrada: (valores: Record<string, number>) => void;
  setValoresCalculados: (valores: Record<string, number | string>) => void;
  setDatosCliente: (datos: DatosCliente) => void;
  setImagenModeloUrl: (url: string) => void;
  setPlanoUrl: (url: string) => void;
  setEsquemaUrl: (url: string) => void;
  limpiarTodo: () => void;
}

// Estado inicial
const initialDatosCliente: DatosCliente = {
  cliente: '',
  referencia: '',
  obra: '',
  comprobanteId: '',
  numeroComprobante: '',
  fecha: new Date().toISOString().split('T')[0],
  vidrioId: '',
  servicioId: '',
  herrajeId: '',
  accesorios: [
    { cantidad: 0, descripcion: '' },
    { cantidad: 0, descripcion: '' },
    { cantidad: 0, descripcion: '' },
  ],
  notas: '',
};

const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

export const ProductoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lineaSeleccionada, setLineaSeleccionada] = useState<string | null>(null);
  const [serieSeleccionada, setSerieSeleccionada] = useState<string | null>(null);
  const [modeloSeleccionado, setModeloSeleccionado] = useState<string | null>(null);
  const [productoId, setProductoId] = useState<string | null>(null);
  const [modeloId, setModeloId] = useState<number | null>(null);

  const [variablesEntrada, setVariablesEntrada] = useState<Variable[]>([]);
  const [valoresEntrada, setValoresEntrada] = useState<Record<string, number>>({});
  const [valoresCalculados, setValoresCalculados] = useState<Record<string, number | string>>({});

  const [datosCliente, setDatosCliente] = useState<DatosCliente>(initialDatosCliente);

  const [imagenModeloUrl, setImagenModeloUrl] = useState<string | null>(null);
  const [planoUrl, setPlanoUrl] = useState<string | null>(null);
  const [esquemaUrl, setEsquemaUrl] = useState<string | null>(null);

  const setProducto = (linea: string, serie: string, modelo: string, prodId: string, modId: number) => {
    setLineaSeleccionada(linea);
    setSerieSeleccionada(serie);
    setModeloSeleccionado(modelo);
    setProductoId(prodId);
    setModeloId(modId);
  };

  const limpiarTodo = () => {
    setLineaSeleccionada(null);
    setSerieSeleccionada(null);
    setModeloSeleccionado(null);
    setProductoId(null);
    setModeloId(null);
    setVariablesEntrada([]);
    setValoresEntrada({});
    setValoresCalculados({});
    setDatosCliente(initialDatosCliente);
    setImagenModeloUrl(null);
    setPlanoUrl(null);
    setEsquemaUrl(null);
  };

  const value = {
    lineaSeleccionada,
    serieSeleccionada,
    modeloSeleccionado,
    productoId,
    modeloId,
    variablesEntrada,
    valoresEntrada,
    valoresCalculados,
    datosCliente,
    imagenModeloUrl,
    planoUrl,
    esquemaUrl,
    setProducto,
    setVariablesEntrada,
    setValoresEntrada,
    setValoresCalculados,
    setDatosCliente,
    setImagenModeloUrl,
    setPlanoUrl,
    setEsquemaUrl,
    limpiarTodo,
  };

  return <ProductoContext.Provider value={value}>{children}</ProductoContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useProducto = () => {
  const context = useContext(ProductoContext);
  if (context === undefined) {
    throw new Error('useProducto debe usarse dentro de un ProductoProvider');
  }
  return context;
};
