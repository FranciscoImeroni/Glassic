import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducto } from '../context/ProductoContext';
import { getOrdenFabricacionUrl } from '../utils/cloudinary';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './VerPlanoPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface CoordenadasPlano {
  id: number;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  align: string;
  variable: {
    codigo: string;
    descripcion: string;
  };
}

interface CoordenadasPlantilla {
  id: number;
  elemento: string;
  x: number;
  y: number;
  width: number | null;
  height: number | null;
  fontSize: number | null;
  fontFamily: string | null;
  fontWeight: string | null;
  color: string | null;
  align: string | null;
}

export default function VerPlanoPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    modeloSeleccionado,
    modeloId,
    valoresCalculados,
    datosCliente,
    planoUrl,
    esquemaUrl,
    limpiarTodo
  } = useProducto();

  const [coordenadasPlano, setCoordenadasPlano] = useState<CoordenadasPlano[]>([]);
  const [coordenadasPlantilla, setCoordenadasPlantilla] = useState<CoordenadasPlantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [error, setError] = useState('');

  // Cargar coordenadas al montar
  useEffect(() => {
    async function cargarCoordenadas() {
      try {
        setLoading(true);
        setError('');

        // Cargar coordenadas de plantilla
        const plantillaResponse = await fetch(`${API_BASE_URL}/coordenadas-plantilla`);
        if (!plantillaResponse.ok) {
          throw new Error('Error al cargar coordenadas de plantilla');
        }
        const plantillaData = await plantillaResponse.json();
        setCoordenadasPlantilla(plantillaData);

        // Cargar coordenadas del plano si hay un modelo seleccionado
        if (modeloId) {
          const planoResponse = await fetch(`${API_BASE_URL}/coordenadas-plano?modeloId=${modeloId}`);
          if (!planoResponse.ok) {
            console.warn('No hay coordenadas de plano para este modelo');
            setCoordenadasPlano([]);
          } else {
            const planoData = await planoResponse.json();
            setCoordenadasPlano(planoData);
          }
        }
      } catch (err: any) {
        console.error('Error al cargar coordenadas:', err);
        setError(`Error al cargar coordenadas: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    cargarCoordenadas();
  }, [modeloId]);

  const handleDescargarPDF = async () => {
    if (!containerRef.current) return;

    try {
      setGenerandoPDF(true);

      // Capturar el contenedor con html2canvas
      const canvas = await html2canvas(containerRef.current, {
        scale: 3, // Alta calidad
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1122, // A4 horizontal a 96 DPI
        height: 794,
        windowWidth: 1122,
        windowHeight: 794,
      });

      // Crear PDF en formato A4 horizontal
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4', // 297 x 210 mm
      });

      // Convertir canvas a imagen y agregar al PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);

      // Descargar PDF
      const nombreArchivo = `orden-fabricacion-${modeloSeleccionado || 'sin-modelo'}-${Date.now()}.pdf`;
      pdf.save(nombreArchivo);

    } catch (err: any) {
      console.error('Error al generar PDF:', err);
      alert(`Error al generar PDF: ${err.message}`);
    } finally {
      setGenerandoPDF(false);
    }
  };

  const handleLimpiarDatos = () => {
    if (window.confirm('¿Estás seguro que deseas limpiar todos los datos?')) {
      limpiarTodo();
      navigate('/');
    }
  };

  // Obtener coordenadas de un elemento de la plantilla
  const getCoordenada = (elemento: string) => {
    return coordenadasPlantilla.find(c => c.elemento === elemento);
  };

  // Si no hay datos del producto, mostrar mensaje
  if (!modeloSeleccionado) {
    return (
      <div className="ver-plano-container">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>No hay datos de producto</h2>
          <p>Por favor, ingresa un producto primero desde la página de Ingresar Producto.</p>
          <button onClick={() => navigate('/ingresar-producto')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Ir a Ingresar Producto
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ver-plano-container">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando orden de fabricación...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ver-plano-container">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          <p>{error}</p>
          <p>La orden se mostrará con valores por defecto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ver-plano-container">
      {/* Botones de acción */}
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
        <button
          onClick={handleDescargarPDF}
          disabled={generandoPDF}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: generandoPDF ? 'not-allowed' : 'pointer',
            opacity: generandoPDF ? 0.6 : 1,
          }}
        >
          {generandoPDF ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
        <button
          onClick={handleLimpiarDatos}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Limpiar Datos
        </button>
      </div>

      {/* Contenedor de la orden de fabricación */}
      <div
        ref={containerRef}
        id="orden-fabricacion-container"
        style={{
          position: 'relative',
          width: '1122px',
          height: '794px',
          margin: '0 auto',
          backgroundImage: `url(${getOrdenFabricacionUrl()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Área del plano con variables calculadas */}
        {planoUrl && getCoordenada('plano_area') && (
          <div
            style={{
              position: 'absolute',
              left: `${getCoordenada('plano_area')!.x}px`,
              top: `${getCoordenada('plano_area')!.y}px`,
              width: `${getCoordenada('plano_area')!.width}px`,
              height: `${getCoordenada('plano_area')!.height}px`,
              backgroundImage: `url(${planoUrl})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Variables calculadas sobre el plano */}
            {coordenadasPlano.map((coord) => {
              const valor = valoresCalculados[coord.variable.codigo];
              if (valor === undefined) return null;

              return (
                <span
                  key={coord.id}
                  style={{
                    position: 'absolute',
                    left: `${coord.x}px`,
                    top: `${coord.y}px`,
                    fontSize: `${coord.fontSize}px`,
                    fontFamily: coord.fontFamily,
                    fontWeight: coord.fontWeight,
                    color: coord.color,
                    textAlign: coord.align as any,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {valor}
                </span>
              );
            })}
          </div>
        )}

        {/* Esquema */}
        {esquemaUrl && getCoordenada('esquema') && (
          <img
            src={esquemaUrl}
            alt="Esquema"
            style={{
              position: 'absolute',
              left: `${getCoordenada('esquema')!.x}px`,
              top: `${getCoordenada('esquema')!.y}px`,
              width: `${getCoordenada('esquema')!.width}px`,
              height: `${getCoordenada('esquema')!.height}px`,
              objectFit: 'contain',
            }}
          />
        )}

        {/* Datos del cliente */}
        {getCoordenada('cliente') && (
          <span
            style={{
              position: 'absolute',
              left: `${getCoordenada('cliente')!.x}px`,
              top: `${getCoordenada('cliente')!.y}px`,
              fontSize: `${getCoordenada('cliente')!.fontSize}px`,
              fontFamily: getCoordenada('cliente')!.fontFamily || 'Arial',
              fontWeight: getCoordenada('cliente')!.fontWeight || 'normal',
              color: getCoordenada('cliente')!.color || '#000000',
            }}
          >
            {datosCliente.cliente}
          </span>
        )}

        {getCoordenada('referencia') && (
          <span
            style={{
              position: 'absolute',
              left: `${getCoordenada('referencia')!.x}px`,
              top: `${getCoordenada('referencia')!.y}px`,
              fontSize: `${getCoordenada('referencia')!.fontSize}px`,
              fontFamily: getCoordenada('referencia')!.fontFamily || 'Arial',
              fontWeight: getCoordenada('referencia')!.fontWeight || 'normal',
              color: getCoordenada('referencia')!.color || '#000000',
            }}
          >
            {datosCliente.referencia}
          </span>
        )}

        {getCoordenada('obra') && (
          <span
            style={{
              position: 'absolute',
              left: `${getCoordenada('obra')!.x}px`,
              top: `${getCoordenada('obra')!.y}px`,
              fontSize: `${getCoordenada('obra')!.fontSize}px`,
              fontFamily: getCoordenada('obra')!.fontFamily || 'Arial',
              fontWeight: getCoordenada('obra')!.fontWeight || 'normal',
              color: getCoordenada('obra')!.color || '#000000',
            }}
          >
            {datosCliente.obra}
          </span>
        )}

        {getCoordenada('fecha') && (
          <span
            style={{
              position: 'absolute',
              left: `${getCoordenada('fecha')!.x}px`,
              top: `${getCoordenada('fecha')!.y}px`,
              fontSize: `${getCoordenada('fecha')!.fontSize}px`,
              fontFamily: getCoordenada('fecha')!.fontFamily || 'Arial',
              fontWeight: getCoordenada('fecha')!.fontWeight || 'normal',
              color: getCoordenada('fecha')!.color || '#000000',
            }}
          >
            {datosCliente.fecha}
          </span>
        )}

        {getCoordenada('notas') && (
          <span
            style={{
              position: 'absolute',
              left: `${getCoordenada('notas')!.x}px`,
              top: `${getCoordenada('notas')!.y}px`,
              fontSize: `${getCoordenada('notas')!.fontSize}px`,
              fontFamily: getCoordenada('notas')!.fontFamily || 'Arial',
              fontWeight: getCoordenada('notas')!.fontWeight || 'normal',
              color: getCoordenada('notas')!.color || '#000000',
              maxWidth: '300px',
              display: 'block',
            }}
          >
            {datosCliente.notas}
          </span>
        )}

        {/* Agregar más elementos según coordenadas disponibles */}
      </div>

      {/* Información de debug (opcional, puedes comentar esto) */}
      {coordenadasPlantilla.length === 0 && (
        <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
          <p>No hay coordenadas de plantilla configuradas.</p>
          <p>La orden se mostrará sin posicionamiento de elementos.</p>
        </div>
      )}
    </div>
  );
}
