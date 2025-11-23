import { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { getOrdenFabricacionUrl } from '../../utils/cloudinary';
import './ConfigurarPlantillaPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Elementos disponibles para configurar
const ELEMENTOS = [
  { id: 'cliente', nombre: 'Cliente', tipo: 'texto' },
  { id: 'referencia', nombre: 'Referencia', tipo: 'texto' },
  { id: 'obra', nombre: 'Obra', tipo: 'texto' },
  { id: 'comprobante_tipo', nombre: 'Tipo Comprobante', tipo: 'texto' },
  { id: 'comprobante_numero', nombre: 'Número Comprobante', tipo: 'texto' },
  { id: 'fecha', nombre: 'Fecha', tipo: 'texto' },
  { id: 'plano_area', nombre: 'Área del Plano', tipo: 'area' },
  { id: 'esquema', nombre: 'Esquema', tipo: 'imagen' },
  { id: 'vidrio_tipo', nombre: 'Tipo de Vidrio', tipo: 'texto' },
  { id: 'vidrio_color', nombre: 'Color de Vidrio', tipo: 'texto' },
  { id: 'servicio', nombre: 'Servicio', tipo: 'texto' },
  { id: 'herraje', nombre: 'Herraje', tipo: 'texto' },
  { id: 'notas', nombre: 'Notas', tipo: 'texto' },
];

interface ElementoCanvas {
  elemento: string;
  objeto: fabric.Object;
  tipo: 'texto' | 'area' | 'imagen';
}

export default function ConfigurarPlantillaPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [elementos, setElementos] = useState<ElementoCanvas[]>([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<string | null>(null);
  const [objetoSeleccionado, setObjetoSeleccionado] = useState<fabric.Object | null>(null);
  const [modoAgregar, setModoAgregar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Propiedades del objeto seleccionado
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState('normal');
  const [color, setColor] = useState('#000000');

  // Inicializar canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 1122,
      height: 794,
      backgroundColor: '#f0f0f0',
    });

    // Cargar imagen de fondo
    fabric.Image.fromURL(
      getOrdenFabricacionUrl(),
      (img) => {
        img.set({
          scaleX: 1122 / (img.width || 1122),
          scaleY: 794 / (img.height || 794),
          selectable: false,
          evented: false,
        });
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
      },
      { crossOrigin: 'anonymous' }
    );

    // Manejar selección de objetos
    fabricCanvas.on('selection:created', (e) => {
      if (e.selected && e.selected[0]) {
        const obj = e.selected[0];
        setObjetoSeleccionado(obj);
        actualizarPropiedadesDesdeObjeto(obj);
      }
    });

    fabricCanvas.on('selection:updated', (e) => {
      if (e.selected && e.selected[0]) {
        const obj = e.selected[0];
        setObjetoSeleccionado(obj);
        actualizarPropiedadesDesdeObjeto(obj);
      }
    });

    fabricCanvas.on('selection:cleared', () => {
      setObjetoSeleccionado(null);
    });

    // Manejar clic en modo agregar
    fabricCanvas.on('mouse:down', (e) => {
      if (modoAgregar && e.pointer) {
        agregarElemento(modoAgregar, e.pointer.x, e.pointer.y);
        setModoAgregar(null);
      }
    });

    setCanvas(fabricCanvas);

    // Cargar coordenadas existentes
    cargarCoordenadasExistentes(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Actualizar canvas cuando cambia modoAgregar
  useEffect(() => {
    if (canvas) {
      canvas.hoverCursor = modoAgregar ? 'crosshair' : 'move';
    }
  }, [modoAgregar, canvas]);

  const actualizarPropiedadesDesdeObjeto = (obj: fabric.Object) => {
    if (obj.type === 'text' || obj.type === 'i-text') {
      const textObj = obj as fabric.Text;
      setFontSize(textObj.fontSize || 14);
      setFontFamily(textObj.fontFamily || 'Arial');
      setFontWeight(textObj.fontWeight as string || 'normal');
      setColor(textObj.fill as string || '#000000');
    }
  };

  const cargarCoordenadasExistentes = async (fabricCanvas: fabric.Canvas) => {
    try {
      const response = await fetch(`${API_BASE_URL}/coordenadas-plantilla`);
      if (!response.ok) return;

      const coordenadas = await response.json();
      const nuevosElementos: ElementoCanvas[] = [];

      coordenadas.forEach((coord: any) => {
        const elementoConfig = ELEMENTOS.find(e => e.id === coord.elemento);
        if (!elementoConfig) return;

        let objeto: fabric.Object;

        if (elementoConfig.tipo === 'area' || elementoConfig.tipo === 'imagen') {
          objeto = new fabric.Rect({
            left: coord.x,
            top: coord.y,
            width: coord.width || 200,
            height: coord.height || 150,
            fill: 'rgba(0, 123, 255, 0.2)',
            stroke: '#007bff',
            strokeWidth: 2,
          });
        } else {
          objeto = new fabric.Text(elementoConfig.nombre, {
            left: coord.x,
            top: coord.y,
            fontSize: coord.fontSize || 14,
            fontFamily: coord.fontFamily || 'Arial',
            fontWeight: coord.fontWeight || 'normal',
            fill: coord.color || '#000000',
          });
        }

        objeto.set({ data: { elemento: coord.elemento } } as any);
        fabricCanvas.add(objeto);
        nuevosElementos.push({
          elemento: coord.elemento,
          objeto,
          tipo: elementoConfig.tipo,
        });
      });

      setElementos(nuevosElementos);
    } catch (error) {
      console.error('Error al cargar coordenadas:', error);
    }
  };

  const agregarElemento = (elementoId: string, x: number, y: number) => {
    if (!canvas) return;

    const elementoConfig = ELEMENTOS.find(e => e.id === elementoId);
    if (!elementoConfig) return;

    // Verificar si ya existe
    if (elementos.some(e => e.elemento === elementoId)) {
      alert(`El elemento "${elementoConfig.nombre}" ya está en el canvas`);
      return;
    }

    let objeto: fabric.Object;

    if (elementoConfig.tipo === 'area' || elementoConfig.tipo === 'imagen') {
      objeto = new fabric.Rect({
        left: x - 100,
        top: y - 75,
        width: 200,
        height: 150,
        fill: 'rgba(0, 123, 255, 0.2)',
        stroke: '#007bff',
        strokeWidth: 2,
      });
    } else {
      objeto = new fabric.Text(elementoConfig.nombre, {
        left: x,
        top: y,
        fontSize,
        fontFamily,
        fontWeight,
        fill: color,
      });
    }

    objeto.set({ data: { elemento: elementoId } } as any);
    canvas.add(objeto);
    canvas.setActiveObject(objeto);
    canvas.renderAll();

    setElementos([...elementos, {
      elemento: elementoId,
      objeto,
      tipo: elementoConfig.tipo,
    }]);
  };

  const eliminarElementoSeleccionado = () => {
    if (!canvas || !objetoSeleccionado) return;

    const data = (objetoSeleccionado as any).data;
    if (data && data.elemento) {
      setElementos(elementos.filter(e => e.elemento !== data.elemento));
    }

    canvas.remove(objetoSeleccionado);
    setObjetoSeleccionado(null);
    canvas.renderAll();
  };

  const aplicarPropiedades = () => {
    if (!canvas || !objetoSeleccionado) return;

    if (objetoSeleccionado.type === 'text' || objetoSeleccionado.type === 'i-text') {
      const textObj = objetoSeleccionado as fabric.Text;
      textObj.set({
        fontSize,
        fontFamily,
        fontWeight,
        fill: color,
      });
      canvas.renderAll();
    }
  };

  const guardarCoordenadas = async () => {
    if (!canvas) return;

    try {
      setLoading(true);
      setStatus('Guardando coordenadas...');

      const coordenadas = elementos.map(e => {
        const obj = e.objeto;
        const base = {
          elemento: e.elemento,
          x: Math.round(obj.left || 0),
          y: Math.round(obj.top || 0),
        };

        if (e.tipo === 'area' || e.tipo === 'imagen') {
          return {
            ...base,
            width: Math.round((obj as fabric.Rect).width || 0),
            height: Math.round((obj as fabric.Rect).height || 0),
            fontSize: null,
            fontFamily: null,
            fontWeight: null,
            color: null,
            align: null,
          };
        } else {
          const textObj = obj as fabric.Text;
          return {
            ...base,
            width: null,
            height: null,
            fontSize: textObj.fontSize || 14,
            fontFamily: textObj.fontFamily || 'Arial',
            fontWeight: textObj.fontWeight || 'normal',
            color: textObj.fill as string || '#000000',
            align: 'left',
          };
        }
      });

      const response = await fetch(`${API_BASE_URL}/coordenadas-plantilla/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordenadas }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar coordenadas');
      }

      setStatus('Coordenadas guardadas correctamente');
      setTimeout(() => setStatus(''), 3000);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="configurar-plantilla-page">
      <h1>Configurar Plantilla de Orden de Fabricación</h1>

      <div className="config-container">
        {/* Panel lateral */}
        <div className="panel-lateral">
          <section className="seccion">
            <h3>Elementos Disponibles</h3>
            <p className="help-text">Haz clic en un elemento y luego en el canvas para posicionarlo</p>
            <div className="elementos-lista">
              {ELEMENTOS.map(elem => {
                const yaAgregado = elementos.some(e => e.elemento === elem.id);
                return (
                  <button
                    key={elem.id}
                    onClick={() => setModoAgregar(elem.id)}
                    disabled={yaAgregado}
                    className={`btn-elemento ${modoAgregar === elem.id ? 'activo' : ''} ${yaAgregado ? 'agregado' : ''}`}
                  >
                    {elem.nombre} {yaAgregado && '✓'}
                  </button>
                );
              })}
            </div>
          </section>

          {objetoSeleccionado && objetoSeleccionado.type !== 'rect' && (
            <section className="seccion">
              <h3>Propiedades del Texto</h3>
              <div className="propiedades">
                <label>
                  Tamaño:
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    min="8"
                    max="72"
                  />
                </label>
                <label>
                  Fuente:
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </label>
                <label>
                  Peso:
                  <select value={fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </label>
                <label>
                  Color:
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </label>
                <button onClick={aplicarPropiedades} className="btn-aplicar">
                  Aplicar
                </button>
              </div>
            </section>
          )}

          {objetoSeleccionado && (
            <section className="seccion">
              <h3>Acciones</h3>
              <button onClick={eliminarElementoSeleccionado} className="btn-eliminar">
                Eliminar Elemento
              </button>
            </section>
          )}

          <section className="seccion">
            <h3>Guardar</h3>
            <button
              onClick={guardarCoordenadas}
              disabled={loading || elementos.length === 0}
              className="btn-guardar"
            >
              {loading ? 'Guardando...' : 'Guardar Coordenadas'}
            </button>
            {status && (
              <p className={`status ${status.includes('Error') ? 'error' : 'success'}`}>
                {status}
              </p>
            )}
          </section>
        </div>

        {/* Canvas */}
        <div className="canvas-container">
          <canvas ref={canvasRef} />
          <p className="help-text">
            {modoAgregar
              ? 'Haz clic en el canvas para posicionar el elemento'
              : 'Arrastra los elementos para posicionarlos'}
          </p>
        </div>
      </div>
    </div>
  );
}
