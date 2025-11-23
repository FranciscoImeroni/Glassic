import { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { getPlanoUrl } from '../../utils/cloudinary';
import './ConfigurarPlanoPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Modelo {
  id: number;
  codigo: string;
  descripcion: string;
}

interface VariableCalculada {
  id: number;
  codigo: string;
  descripcion: string;
}

interface ElementoCanvas {
  variableId: number;
  codigo: string;
  objeto: fabric.Text;
}

export default function ConfigurarPlanoPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  // Estado del modelo
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState<number | null>(null);
  const [modeloCodigo, setModeloCodigo] = useState<string>('');

  // Variables calculadas
  const [variables, setVariables] = useState<VariableCalculada[]>([]);
  const [elementos, setElementos] = useState<ElementoCanvas[]>([]);

  // Estado UI
  const [objetoSeleccionado, setObjetoSeleccionado] = useState<fabric.Object | null>(null);
  const [modoAgregar, setModoAgregar] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Propiedades del objeto seleccionado
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState('normal');
  const [color, setColor] = useState('#000000');

  // Cargar modelos al montar
  useEffect(() => {
    cargarModelos();
  }, []);

  // Inicializar canvas cuando se selecciona un modelo
  useEffect(() => {
    if (modeloSeleccionado && modeloCodigo) {
      inicializarCanvas();
      cargarVariablesDelModelo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeloSeleccionado, modeloCodigo]);

  const cargarModelos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/formulas/modelos`);
      if (!response.ok) throw new Error('Error al cargar modelos');
      const data = await response.json();
      setModelos(data);
    } catch (error) {
      console.error('Error al cargar modelos:', error);
      setStatus('Error al cargar modelos');
    }
  };

  const cargarVariablesDelModelo = async () => {
    if (!modeloSeleccionado) return;

    try {
      const response = await fetch(`${API_BASE_URL}/formulas/calculadas/modelo/${modeloSeleccionado}`);
      if (!response.ok) {
        setVariables([]);
        return;
      }
      const formulas = await response.json();

      // Extraer variables únicas
      const variablesUnicas = formulas.map((f: any) => f.variable);
      setVariables(variablesUnicas);
    } catch (error) {
      console.error('Error al cargar variables:', error);
      setVariables([]);
    }
  };

  const inicializarCanvas = () => {
    if (!canvasRef.current || !modeloCodigo) return;

    // Limpiar canvas anterior si existe
    if (canvas) {
      canvas.dispose();
    }

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0',
    });

    // Cargar imagen del plano
    const planoUrl = getPlanoUrl(modeloCodigo);
    fabric.Image.fromURL(
      planoUrl,
      (img) => {
        const scale = Math.min(800 / (img.width || 800), 600 / (img.height || 600));
        img.set({
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
        });
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
      },
      { crossOrigin: 'anonymous' }
    );

    // Eventos de selección
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
      if (modoAgregar !== null && e.pointer) {
        agregarVariable(modoAgregar, e.pointer.x, e.pointer.y);
        setModoAgregar(null);
      }
    });

    setCanvas(fabricCanvas);
    setElementos([]);

    // Cargar coordenadas existentes
    cargarCoordenadasExistentes(fabricCanvas);
  };

  const actualizarPropiedadesDesdeObjeto = (obj: fabric.Object) => {
    if (obj.type === 'text' || obj.type === 'i-text') {
      const textObj = obj as fabric.Text;
      setFontSize(textObj.fontSize || 14);
      setFontFamily(textObj.fontFamily || 'Arial');
      setFontWeight(String(textObj.fontWeight || 'normal'));
      setColor(String(textObj.fill || '#000000'));
    }
  };

  const cargarCoordenadasExistentes = async (fabricCanvas: fabric.Canvas) => {
    if (!modeloSeleccionado) return;

    try {
      const response = await fetch(`${API_BASE_URL}/coordenadas-plano?modeloId=${modeloSeleccionado}`);
      if (!response.ok) return;

      const coordenadas = await response.json();
      const nuevosElementos: ElementoCanvas[] = [];

      coordenadas.forEach((coord: any) => {
        const texto = new fabric.Text(coord.variable.codigo, {
          left: coord.x,
          top: coord.y,
          fontSize: coord.fontSize,
          fontFamily: coord.fontFamily,
          fontWeight: coord.fontWeight,
          fill: coord.color,
        });

        texto.set({ data: { variableId: coord.variable.id } } as any);
        fabricCanvas.add(texto);
        nuevosElementos.push({
          variableId: coord.variable.id,
          codigo: coord.variable.codigo,
          objeto: texto,
        });
      });

      setElementos(nuevosElementos);
    } catch (error) {
      console.error('Error al cargar coordenadas:', error);
    }
  };

  const agregarVariable = (variableId: number, x: number, y: number) => {
    if (!canvas) return;

    const variable = variables.find(v => v.id === variableId);
    if (!variable) return;

    // Verificar si ya está agregada
    if (elementos.some(e => e.variableId === variableId)) {
      alert(`La variable "${variable.codigo}" ya está en el canvas`);
      return;
    }

    const texto = new fabric.Text(variable.codigo, {
      left: x,
      top: y,
      fontSize,
      fontFamily,
      fontWeight,
      fill: color,
    });

    texto.set({ data: { variableId } } as any);
    canvas.add(texto);
    canvas.setActiveObject(texto);
    canvas.renderAll();

    setElementos([...elementos, {
      variableId,
      codigo: variable.codigo,
      objeto: texto,
    }]);
  };

  const eliminarElementoSeleccionado = () => {
    if (!canvas || !objetoSeleccionado) return;

    const data = (objetoSeleccionado as any).data;
    if (data && data.variableId) {
      setElementos(elementos.filter(e => e.variableId !== data.variableId));
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
    if (!canvas || !modeloSeleccionado) return;

    try {
      setLoading(true);
      setStatus('Guardando coordenadas...');

      const coordenadas = elementos.map(e => ({
        modeloId: modeloSeleccionado,
        variableId: e.variableId,
        x: Math.round(e.objeto.left || 0),
        y: Math.round(e.objeto.top || 0),
        fontSize: e.objeto.fontSize || 14,
        fontFamily: e.objeto.fontFamily || 'Arial',
        fontWeight: String(e.objeto.fontWeight || 'normal'),
        color: String(e.objeto.fill || '#000000'),
        align: 'left',
      }));

      const response = await fetch(`${API_BASE_URL}/coordenadas-plano/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modeloId: modeloSeleccionado, coordenadas }),
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

  const handleModeloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    const modelo = modelos.find(m => m.id === id);
    if (modelo) {
      setModeloSeleccionado(id);
      setModeloCodigo(modelo.codigo);
      setElementos([]);
      setVariables([]);
    }
  };

  return (
    <div className="configurar-plano-page">
      <h1>Configurar Coordenadas de Plano</h1>

      <div className="config-container">
        {/* Panel lateral */}
        <div className="panel-lateral">
          <section className="seccion">
            <h3>Seleccionar Modelo</h3>
            <select
              value={modeloSeleccionado || ''}
              onChange={handleModeloChange}
              className="select-modelo"
            >
              <option value="">Seleccione un modelo...</option>
              {modelos.map(modelo => (
                <option key={modelo.id} value={modelo.id}>
                  {modelo.codigo} - {modelo.descripcion}
                </option>
              ))}
            </select>
          </section>

          {modeloSeleccionado && (
            <>
              <section className="seccion">
                <h3>Variables Calculadas</h3>
                <p className="help-text">Haz clic en una variable y luego en el plano para posicionarla</p>
                <div className="elementos-lista">
                  {variables.length > 0 ? (
                    variables.map(variable => {
                      const yaAgregada = elementos.some(e => e.variableId === variable.id);
                      return (
                        <button
                          key={variable.id}
                          onClick={() => setModoAgregar(variable.id)}
                          disabled={yaAgregada}
                          className={`btn-elemento ${modoAgregar === variable.id ? 'activo' : ''} ${yaAgregada ? 'agregado' : ''}`}
                          title={variable.descripcion}
                        >
                          {variable.codigo} {yaAgregada && '✓'}
                        </button>
                      );
                    })
                  ) : (
                    <p className="help-text">No hay variables calculadas para este modelo</p>
                  )}
                </div>
              </section>

              {objetoSeleccionado && (
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
                    Eliminar Variable
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
            </>
          )}
        </div>

        {/* Canvas */}
        <div className="canvas-container">
          {modeloSeleccionado ? (
            <>
              <canvas ref={canvasRef} />
              <p className="help-text">
                {modoAgregar !== null
                  ? 'Haz clic en el plano para posicionar la variable'
                  : 'Arrastra las variables para posicionarlas'}
              </p>
            </>
          ) : (
            <div className="mensaje-inicial">
              <p>Selecciona un modelo para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
