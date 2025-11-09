import { useState, useEffect } from 'react';
import {
  getLineasProductos,
  getSeriesProductos,
  getModelosProductos,
  getEspesoresVidrio,
  createProducto,
} from '../../api/index';
import './IngresarProductoPage.css';

export default function IngresarProductoPage() {
  const [formData, setFormData] = useState({
    linea: '',
    serie: '',
    modelo: '',
    medidas: Array(10).fill(''),
    espesorVidrio: '',
  });

  // Estados para datos desde la BD
  const [lineas, setLineas] = useState<string[]>([]);
  const [series, setSeries] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [espesores, setEspesores] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  // Cargar datos desde la BD al montar el componente
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [lineasData, seriesData, modelosData, espesoresData] = await Promise.all([
          getLineasProductos(),
          getSeriesProductos(),
          getModelosProductos(),
          getEspesoresVidrio(),
        ]);

        setLineas(lineasData);
        setSeries(seriesData);
        setModelos(modelosData);
        setEspesores(espesoresData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setStatus('Error al cargar catálogos. Usando valores por defecto.');
        // Valores por defecto en caso de error
        setLineas(['Linea 1000', 'Linea 4000']);
        setSeries(['Panel', 'Panel Angulo', 'Box Frontal', 'Box Esquinero', 'Box Angular']);
        setModelos(['1000', '1010-i', '1010-d', '4000-Ai', '4200-A1i']);
        setEspesores([6, 8, 10, 12]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMedidaChange = (index: number, value: string) => {
    const newMedidas = [...formData.medidas];
    newMedidas[index] = value;
    setFormData((prev) => ({
      ...prev,
      medidas: newMedidas,
    }));
  };

  const handleAplicar = async () => {
    try {
      console.log('Datos del formulario:', formData);

      // Validar que los campos requeridos estén llenos
      if (!formData.linea || !formData.serie || !formData.modelo) {
        setStatus('Por favor complete los campos requeridos (Línea, Serie, Modelo)');
        return;
      }

      // Aquí puedes hacer el submit al backend
      // const productoData = {
      //   linea: formData.linea,
      //   serie: formData.serie,
      //   modelo: formData.modelo,
      //   espVidrio: parseInt(formData.espesorVidrio),
      //   // ... otros campos
      // };
      // await createProducto(productoData);

      setStatus('Producto aplicado correctamente');
    } catch (error) {
      console.error('Error al aplicar producto:', error);
      setStatus('Error al aplicar producto');
    }
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
              >
                <option value="">Seleccione...</option>
                {series.map((serie) => (
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
              >
                <option value="">Seleccione...</option>
                {modelos.map((modelo) => (
                  <option key={modelo} value={modelo}>
                    {modelo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="aplicar-btn" onClick={handleAplicar}>
            APLICAR
          </button>
        </div>

        <div className="form-content">
          <div className="imagen-section">
            <div className="imagen-placeholder">
              {/* Aquí se mostrará la imagen del producto cuando esté disponible */}
            </div>
          </div>

          <div className="medidas-section">
            <h3>MEDIDAS EN mm:</h3>
            <div className="medidas-grid">
              {formData.medidas.map((medida, index) => (
                <input
                  key={index}
                  type="number"
                  value={medida}
                  onChange={(e) => handleMedidaChange(index, e.target.value)}
                  className="medida-input"
                  placeholder={`Medida ${index + 1}`}
                />
              ))}
            </div>

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
          <div className="status-message" style={{ marginTop: '1rem', textAlign: 'center' }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
