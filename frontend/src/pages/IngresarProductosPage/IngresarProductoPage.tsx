import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducto } from '../../context/ProductoContext';
import {
  getProductos,
  getEspesoresVidrio,
  type Producto,
} from '../../api/index';
import { getModeloImageUrl, getPlanoUrl, getEsquemaUrl } from '../../utils/cloudinary';
import './IngresarProductoPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Variable {
  id: string;
  codigo: string;
  nombre: string;
}

export default function IngresarProductoPage() {
  const navigate = useNavigate();
  const {
    setProducto,
    setVariablesEntrada,
    setValoresEntrada,
    setValoresCalculados,
    setImagenModeloUrl,
    setPlanoUrl,
    setEsquemaUrl,
  } = useProducto();

  const [formData, setFormData] = useState({
    linea: '',
    serie: '',
    modelo: '',
    espesorVidrio: '',
  });

  // Estados para datos desde la BD
  const [productos, setProductos] = useState<Producto[]>([]);
  const [lineas, setLineas] = useState<string[]>([]);
  const [seriesFiltradas, setSeriesFiltradas] = useState<string[]>([]);
  const [modelosFiltrados, setModelosFiltrados] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [variablesParaIngresar, setVariablesParaIngresar] = useState<Variable[]>([]);
  const [valoresMedidas, setValoresMedidas] = useState<Record<string, number>>({});
  const [espesores, setEspesores] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculando, setCalculando] = useState(false);
  const [status, setStatus] = useState('');
  const [imageError, setImageError] = useState(false);
  const [imageAttempts, setImageAttempts] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');

  // Cargar datos desde la BD al montar el componente
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [productosData, espesoresData] = await Promise.all([
          getProductos(),
          getEspesoresVidrio(),
        ]);

        setProductos(productosData);
        // Extraer líneas únicas
        const lineasUnicas = [...new Set(productosData.map(p => p.linea))];
        setLineas(lineasUnicas);
        setEspesores(espesoresData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setStatus('Error al cargar catálogos. Usando valores por defecto.');
        // Valores por defecto en caso de error
        setLineas(['Linea 1000', 'Linea 4000']);
        setEspesores([6, 8, 10, 12]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filtrar series cuando cambia la línea
  useEffect(() => {
    if (formData.linea) {
      const productosFiltrados = productos.filter(p => p.linea === formData.linea);
      const seriesUnicas = [...new Set(productosFiltrados.map(p => p.serie))];
      setSeriesFiltradas(seriesUnicas);
    } else {
      setSeriesFiltradas([]);
    }
    // Limpiar campos dependientes
    setFormData(prev => ({ ...prev, serie: '', modelo: '' }));
    setModelosFiltrados([]);
    setProductoSeleccionado(null);
    setVariablesParaIngresar([]);
    setValoresMedidas({});
    setImageError(false);
    setImageAttempts(0);
    setCurrentImageUrl('');
  }, [formData.linea, productos]);

  // Filtrar modelos cuando cambia la serie
  useEffect(() => {
    if (formData.linea && formData.serie) {
      const productosFiltrados = productos.filter(
        p => p.linea === formData.linea && p.serie === formData.serie
      );
      setModelosFiltrados(productosFiltrados);
    } else {
      setModelosFiltrados([]);
    }
    // Limpiar modelo
    setFormData(prev => ({ ...prev, modelo: '' }));
    setProductoSeleccionado(null);
    setVariablesParaIngresar([]);
    setValoresMedidas({});
    setImageError(false);
    setImageAttempts(0);
    setCurrentImageUrl('');
  }, [formData.serie, formData.linea, productos]);

  // Cargar variables cuando se selecciona un modelo
  useEffect(() => {
    if (formData.modelo) {
      const producto = modelosFiltrados.find(p => p.modelo === formData.modelo);
      if (producto) {
        setProductoSeleccionado(producto);
        cargarVariablesDeEntrada(producto.id);
        setCurrentImageUrl(getModeloImageUrl(formData.modelo, { width: 400 }));
        setImageError(false);
        setImageAttempts(0);
      }
    } else {
      setProductoSeleccionado(null);
      setVariablesParaIngresar([]);
      setValoresMedidas({});
      setCurrentImageUrl('');
      setImageError(false);
      setImageAttempts(0);
    }
  }, [formData.modelo, modelosFiltrados]);

  const cargarVariablesDeEntrada = async (productoId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${productoId}/variables-entrada`);
      if (!response.ok) {
        throw new Error('Error al cargar variables de entrada');
      }
      const variables: Variable[] = await response.json();
      setVariablesParaIngresar(variables);
      // Inicializar valores vacíos
      const valoresIniciales: Record<string, number> = {};
      variables.forEach(v => {
        valoresIniciales[v.codigo] = 0;
      });
      setValoresMedidas(valoresIniciales);
    } catch (error) {
      console.error('Error al cargar variables de entrada:', error);
      setStatus('Error al cargar variables de entrada');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMedidaChange = (codigo: string, value: string) => {
    setValoresMedidas((prev) => ({
      ...prev,
      [codigo]: parseFloat(value) || 0,
    }));
  };

  const handleImageError = () => {
    // Cap de 3 intentos máximo
    if (imageAttempts >= 3) {
      setImageError(true);
      return;
    }

    setImageAttempts(prev => prev + 1);

    // Intento 1: Sin guiones (ej: 1000-d → 1000d)
    if (imageAttempts === 0 && formData.modelo) {
      const modeloSinGuiones = formData.modelo.replace(/-/g, '');
      setCurrentImageUrl(getModeloImageUrl(modeloSinGuiones, { width: 400 }));
      return;
    }

    // Intento 2: Sin guiones y lowercase (ej: 1000-D → 1000d)
    if (imageAttempts === 1 && formData.modelo) {
      const modeloSinGuiones = formData.modelo.replace(/-/g, '').toLowerCase();
      setCurrentImageUrl(getModeloImageUrl(modeloSinGuiones, { width: 400 }));
      return;
    }

    // Si llegamos aquí y no hay más variantes, mostrar error
    setImageError(true);
  };

  const handleAplicar = async () => {
    try {
      // Validar que los campos requeridos estén llenos
      if (!formData.linea || !formData.serie || !formData.modelo || !productoSeleccionado) {
        setStatus('Por favor complete los campos requeridos (Línea, Serie, Modelo)');
        return;
      }

      // Validar que se hayan ingresado valores
      const hayValoresIngresados = Object.values(valoresMedidas).some(v => v > 0);
      if (!hayValoresIngresados) {
        setStatus('Por favor ingrese al menos una medida');
        return;
      }

      setCalculando(true);
      setStatus('Calculando fórmulas...');

      // Necesitamos el modeloId de la tabla de fórmulas
      // Asumiendo que el modelo de producto tiene un campo relacionado o usamos el codigo del modelo
      // Por ahora, vamos a obtener el modelo por codigo desde el backend
      const modelosResponse = await fetch(`${API_BASE_URL}/formulas/modelos`);
      if (!modelosResponse.ok) {
        throw new Error('Error al obtener modelos de fórmulas');
      }
      const modelos = await modelosResponse.json();
      const modeloFormulas = modelos.find((m: any) =>
        m.codigo === formData.modelo ||
        m.codigo.replace(/-/g, '') === formData.modelo.replace(/-/g, '')
      );

      if (!modeloFormulas) {
        setStatus('No se encontraron fórmulas para este modelo. Continuando sin cálculos.');
        // Guardar en contexto sin valores calculados
        guardarEnContexto({});
        return;
      }

      // Llamar al endpoint de calcular fórmulas
      const calcularResponse = await fetch(`${API_BASE_URL}/formulas/calcular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modeloId: modeloFormulas.id,
          valoresEntrada: valoresMedidas,
        }),
      });

      if (!calcularResponse.ok) {
        const errorData = await calcularResponse.json();
        throw new Error(errorData.message || 'Error al calcular fórmulas');
      }

      const { valoresCalculados } = await calcularResponse.json();

      // Guardar todo en el contexto
      guardarEnContexto(valoresCalculados);

    } catch (error: any) {
      console.error('Error al aplicar producto:', error);
      setStatus(`Error: ${error.message}`);
      setCalculando(false);
    }
  };

  const guardarEnContexto = (valoresCalculados: Record<string, number | string>) => {
    // Guardar producto seleccionado
    setProducto(
      formData.linea,
      formData.serie,
      formData.modelo,
      productoSeleccionado!.id,
      0 // modeloId lo obtenemos al calcular
    );

    // Guardar variables de entrada
    setVariablesEntrada(variablesParaIngresar);

    // Guardar valores ingresados
    setValoresEntrada(valoresMedidas);

    // Guardar valores calculados
    setValoresCalculados(valoresCalculados);

    // Guardar URLs de imágenes
    setImagenModeloUrl(getModeloImageUrl(formData.modelo));
    setPlanoUrl(getPlanoUrl(formData.modelo));
    setEsquemaUrl(getEsquemaUrl(formData.modelo));

    setStatus('Datos guardados correctamente. Redirigiendo...');
    setCalculando(false);

    // Navegar a la página de ingresar datos
    setTimeout(() => {
      navigate('/ingresar-datos');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="ingresar-producto-container">
        <h1 className="page-title">INGRESAR PRODUCTO</h1>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando catálogos...</div>
      </div>
    );
  }

  return (
    <div className="ingresar-producto-container">
      <h1 className="page-title">INGRESAR PRODUCTO</h1>
      <div className="producto-form">
        <div className="form-header">
          <div className="form-fields">
            <div className="field-group">
              <label>LINEA:</label>
              <select
                value={formData.linea}
                onChange={(e) => handleInputChange('linea', e.target.value)}
                className="dropdown"
              >
                <option value="">Seleccione...</option>
                {lineas.map((linea) => (
                  <option key={linea} value={linea}>
                    {linea}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>SERIE:</label>
              <select
                value={formData.serie}
                onChange={(e) => handleInputChange('serie', e.target.value)}
                className="dropdown"
                disabled={!formData.linea}
              >
                <option value="">
                  {formData.linea ? 'Seleccione...' : 'Primero seleccione Línea'}
                </option>
                {seriesFiltradas.map((serie) => (
                  <option key={serie} value={serie}>
                    {serie}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>MODELO:</label>
              <select
                value={formData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                className="dropdown"
                disabled={!formData.serie}
              >
                <option value="">
                  {formData.serie ? 'Seleccione...' : 'Primero seleccione Serie'}
                </option>
                {modelosFiltrados.map((producto) => (
                  <option key={producto.id} value={producto.modelo}>
                    {producto.modelo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="aplicar-btn"
            onClick={handleAplicar}
            disabled={calculando || !productoSeleccionado || variablesParaIngresar.length === 0}
          >
            {calculando ? 'CALCULANDO...' : 'APLICAR'}
          </button>
        </div>

        <div className="form-content">
          <div className="imagen-section">
            <div className="imagen-placeholder">
              {formData.modelo ? (
                imageError ? (
                  <p>Imagen no disponible para {formData.modelo}</p>
                ) : (
                  <img
                    key={currentImageUrl}
                    src={currentImageUrl}
                    alt={`Modelo ${formData.modelo}`}
                    className="modelo-image"
                    onError={handleImageError}
                  />
                )
              ) : (
                <p>Seleccione un modelo para ver la imagen</p>
              )}
            </div>
          </div>

          <div className="medidas-section">
            <h3>MEDIDAS EN mm:</h3>
            {variablesParaIngresar.length > 0 ? (
              <div className="medidas-grid">
                {variablesParaIngresar.map((variable) => (
                  <div key={variable.id} style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      minWidth: '150px',
                      textAlign: 'right',
                      color: '#333'
                    }}>
                      {variable.nombre}:
                    </label>
                    <input
                      type="number"
                      value={valoresMedidas[variable.codigo] || ''}
                      onChange={(e) => handleMedidaChange(variable.codigo, e.target.value)}
                      className="medida-input"
                      placeholder={variable.codigo}
                      style={{ flex: 1, maxWidth: '200px' }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>Seleccione un modelo para ver las medidas requeridas</p>
            )}

            <div className="espesor-section">
              <label>ESPESOR VIDRIO:</label>
              <select
                value={formData.espesorVidrio}
                onChange={(e) => handleInputChange('espesorVidrio', e.target.value)}
                className="espesor-dropdown"
              >
                <option value="">Seleccione...</option>
                {espesores.map((espesor) => (
                  <option key={espesor} value={espesor}>
                    {espesor}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {status && (
          <div className="status-message" style={{ marginTop: '1rem', textAlign: 'center', color: status.includes('Error') ? 'red' : 'green' }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
