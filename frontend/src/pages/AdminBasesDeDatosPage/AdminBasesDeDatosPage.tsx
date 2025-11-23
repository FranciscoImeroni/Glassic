import { useState, useEffect } from 'react';
import type {
  Vidrio,
  Servicio,
  Herraje,
  Accesorio,
  Producto,
  Modelo,
  VariableCalculada,
  FormulaCalculada,
  ValorFijo,
  Kit,
  PaginatedResponse,
} from '../../api';
import {
  getVidriosPaginated,
  getServiciosPaginated,
  getHerrajesPaginated,
  getAccesoriosPaginated,
  getProductosPaginated,
  getModelosPaginated,
  getVariablesCalculadasPaginated,
  getFormulasCalculadasPaginated,
  getValoresFijosPaginated,
  getKitsPaginated,
  createVidrio,
  createServicio,
  createHerraje,
  createAccesorio,
  createProducto,
  createModelo,
  createVariableCalculada,
  createFormulaCalculada,
  createValorFijo,
  createKit,
} from '../../api';
import './AdminBasesDeDatosPage.css';

type TabType = 'vidrios' | 'servicios' | 'herrajes' | 'accesorios' | 'productos' | 'modelos' | 'variablesCalculadas' | 'formulas' | 'valoresFijos' | 'kits';

interface DataTableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string }[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onAddNew: () => void;
}

function DataTable<T>({
  data,
  columns,
  loading,
  error,
  page,
  totalPages,
  total,
  onPageChange,
  onAddNew,
}: DataTableProps<T>) {
  if (loading) {
    return <div className="loading-message">Cargando datos...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  const startRecord = data.length > 0 ? (page - 1) * 20 + 1 : 0;
  const endRecord = Math.min(page * 20, total);
  const showPagination = totalPages > 1;

  return (
    <>
      <div className="table-header-actions">
        <button className="btn-add-new" onClick={onAddNew}>
          + Agregar Nuevo
        </button>
      </div>

      {data.length === 0 ? (
        <div className="empty-message">No hay datos. Agrega el primero usando el botón de arriba.</div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={String(col.key)}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={String(col.key)}>{String(row[col.key] || '-')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination && (
            <div className="pagination">
              <div className="pagination-info">
                Mostrando {startRecord} - {endRecord} de {total} registros
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-button"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </button>
                <span className="page-number">
                  Página {page} de {totalPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function AdminBasesDeDatosPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vidrios');
  const [showForm, setShowForm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Estados para Vidrios
  const [vidriosData, setVidriosData] = useState<PaginatedResponse<Vidrio>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [vidriosPage, setVidriosPage] = useState(1);
  const [vidriosLoading, setVidriosLoading] = useState(false);
  const [vidriosError, setVidriosError] = useState<string | null>(null);
  const [formVidrio, setFormVidrio] = useState({ tipo: '', color: '' });

  // Estados para Servicios
  const [serviciosData, setServiciosData] = useState<PaginatedResponse<Servicio>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [serviciosPage, setServiciosPage] = useState(1);
  const [serviciosLoading, setServiciosLoading] = useState(false);
  const [serviciosError, setServiciosError] = useState<string | null>(null);
  const [formServicio, setFormServicio] = useState({ nombre: '' });

  // Estados para Herrajes
  const [herrajesData, setHerrajesData] = useState<PaginatedResponse<Herraje>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [herrajesPage, setHerrajesPage] = useState(1);
  const [herrajesLoading, setHerrajesLoading] = useState(false);
  const [herrajesError, setHerrajesError] = useState<string | null>(null);
  const [formHerraje, setFormHerraje] = useState({ color: '' });

  // Estados para Accesorios
  const [accesoriosData, setAccesoriosData] = useState<PaginatedResponse<Accesorio>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [accesoriosPage, setAccesoriosPage] = useState(1);
  const [accesoriosLoading, setAccesoriosLoading] = useState(false);
  const [accesoriosError, setAccesoriosError] = useState<string | null>(null);
  const [formAccesorio, setFormAccesorio] = useState({ descripcion: '' });

  // Estados para Productos
  const [productosData, setProductosData] = useState<PaginatedResponse<Producto>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [productosPage, setProductosPage] = useState(1);
  const [productosLoading, setProductosLoading] = useState(false);
  const [productosError, setProductosError] = useState<string | null>(null);
  const [formProducto, setFormProducto] = useState({
    linea: '',
    serie: '',
    modelo: '',
    varVi: '',
    codIvi: '',
    espVidrio: 6,
  });

  // Estados para Modelos
  const [modelosData, setModelosData] = useState<PaginatedResponse<Modelo>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [modelosPage, setModelosPage] = useState(1);
  const [modelosLoading, setModelosLoading] = useState(false);
  const [modelosError, setModelosError] = useState<string | null>(null);
  const [formModelo, setFormModelo] = useState({ codigo: '', nombre: '' });

  // Estados para Variables Calculadas
  const [variablesCalculadasData, setVariablesCalculadasData] = useState<PaginatedResponse<VariableCalculada>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [variablesCalculadasPage, setVariablesCalculadasPage] = useState(1);
  const [variablesCalculadasLoading, setVariablesCalculadasLoading] = useState(false);
  const [variablesCalculadasError, setVariablesCalculadasError] = useState<string | null>(null);
  const [formVariableCalculada, setFormVariableCalculada] = useState({ codigo: '', nombre: '', descripcion: '' });

  // Estados para Fórmulas Calculadas
  const [formulasData, setFormulasData] = useState<PaginatedResponse<FormulaCalculada>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [formulasPage, setFormulasPage] = useState(1);
  const [formulasLoading, setFormulasLoading] = useState(false);
  const [formulasError, setFormulasError] = useState<string | null>(null);
  const [formFormula, setFormFormula] = useState({
    modeloId: '',
    variableId: '',
    expresion: '',
    orden: 0,
    activa: true,
  });

  // Estados para Valores Fijos
  const [valoresFijosData, setValoresFijosData] = useState<PaginatedResponse<ValorFijo>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [valoresFijosPage, setValoresFijosPage] = useState(1);
  const [valoresFijosLoading, setValoresFijosLoading] = useState(false);
  const [valoresFijosError, setValoresFijosError] = useState<string | null>(null);
  const [formValorFijo, setFormValorFijo] = useState({ clave: '', valor: '', descripcion: '' });

  // Estados para Kits
  const [kitsData, setKitsData] = useState<PaginatedResponse<Kit>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [kitsPage, setKitsPage] = useState(1);
  const [kitsLoading, setKitsLoading] = useState(false);
  const [kitsError, setKitsError] = useState<string | null>(null);
  const [formKit, setFormKit] = useState({ codigo: '', descripcion: '' });

  // Cargar datos según el tab activo
  const loadData = async () => {
    switch (activeTab) {
      case 'vidrios':
        setVidriosLoading(true);
        setVidriosError(null);
        try {
          const result = await getVidriosPaginated(vidriosPage, 20);
          setVidriosData(result);
        } catch (err) {
          setVidriosError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setVidriosLoading(false);
        }
        break;

      case 'servicios':
        setServiciosLoading(true);
        setServiciosError(null);
        try {
          const result = await getServiciosPaginated(serviciosPage, 20);
          setServiciosData(result);
        } catch (err) {
          setServiciosError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setServiciosLoading(false);
        }
        break;

      case 'herrajes':
        setHerrajesLoading(true);
        setHerrajesError(null);
        try {
          const result = await getHerrajesPaginated(herrajesPage, 20);
          setHerrajesData(result);
        } catch (err) {
          setHerrajesError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setHerrajesLoading(false);
        }
        break;

      case 'accesorios':
        setAccesoriosLoading(true);
        setAccesoriosError(null);
        try {
          const result = await getAccesoriosPaginated(accesoriosPage, 20);
          setAccesoriosData(result);
        } catch (err) {
          setAccesoriosError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setAccesoriosLoading(false);
        }
        break;

      case 'productos':
        setProductosLoading(true);
        setProductosError(null);
        try {
          const result = await getProductosPaginated(productosPage, 20);
          setProductosData(result);
        } catch (err) {
          setProductosError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setProductosLoading(false);
        }
        break;

      case 'modelos':
        setModelosLoading(true);
        setModelosError(null);
        try {
          const result = await getModelosPaginated(modelosPage, 20);
          setModelosData(result);
        } catch (err) {
          setModelosError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setModelosLoading(false);
        }
        break;

      case 'variablesCalculadas':
        setVariablesCalculadasLoading(true);
        setVariablesCalculadasError(null);
        try {
          const result = await getVariablesCalculadasPaginated(variablesCalculadasPage, 20);
          setVariablesCalculadasData(result);
        } catch (err) {
          setVariablesCalculadasError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setVariablesCalculadasLoading(false);
        }
        break;

      case 'formulas':
        setFormulasLoading(true);
        setFormulasError(null);
        try {
          const result = await getFormulasCalculadasPaginated(formulasPage, 20);
          setFormulasData(result);
        } catch (err) {
          setFormulasError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setFormulasLoading(false);
        }
        break;

      case 'valoresFijos':
        setValoresFijosLoading(true);
        setValoresFijosError(null);
        try {
          const result = await getValoresFijosPaginated(valoresFijosPage, 20);
          setValoresFijosData(result);
        } catch (err) {
          setValoresFijosError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setValoresFijosLoading(false);
        }
        break;

      case 'kits':
        setKitsLoading(true);
        setKitsError(null);
        try {
          const result = await getKitsPaginated(kitsPage, 20);
          setKitsData(result);
        } catch (err) {
          setKitsError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setKitsLoading(false);
        }
        break;
    }
  };

  useEffect(() => {
    loadData();
  }, [
    activeTab,
    vidriosPage,
    serviciosPage,
    herrajesPage,
    accesoriosPage,
    productosPage,
    modelosPage,
    variablesCalculadasPage,
    formulasPage,
    valoresFijosPage,
    kitsPage,
  ]);

  const handleAddNew = () => {
    setShowForm(true);
    setSaveStatus('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setSaveStatus('');
    // Limpiar formularios
    setFormVidrio({ tipo: '', color: '' });
    setFormServicio({ nombre: '' });
    setFormHerraje({ color: '' });
    setFormAccesorio({ descripcion: '' });
    setFormProducto({ linea: '', serie: '', modelo: '', varVi: '', codIvi: '', espVidrio: 6 });
    setFormModelo({ codigo: '', nombre: '' });
    setFormVariableCalculada({ codigo: '', nombre: '', descripcion: '' });
    setFormFormula({ modeloId: '', variableId: '', expresion: '', orden: 0, activa: true });
    setFormValorFijo({ clave: '', valor: '', descripcion: '' });
    setFormKit({ codigo: '', descripcion: '' });
  };

  const handleSave = async () => {
    try {
      setSaveStatus('Guardando...');

      switch (activeTab) {
        case 'vidrios':
          await createVidrio(formVidrio);
          setFormVidrio({ tipo: '', color: '' });
          break;

        case 'servicios':
          await createServicio(formServicio);
          setFormServicio({ nombre: '' });
          break;

        case 'herrajes':
          await createHerraje(formHerraje);
          setFormHerraje({ color: '' });
          break;

        case 'accesorios':
          await createAccesorio(formAccesorio);
          setFormAccesorio({ descripcion: '' });
          break;

        case 'productos':
          await createProducto({ ...formProducto, variables: [], instrucciones: [] });
          setFormProducto({ linea: '', serie: '', modelo: '', varVi: '', codIvi: '', espVidrio: 6 });
          break;

        case 'modelos':
          await createModelo(formModelo);
          setFormModelo({ codigo: '', nombre: '' });
          break;

        case 'variablesCalculadas':
          await createVariableCalculada(formVariableCalculada);
          setFormVariableCalculada({ codigo: '', nombre: '', descripcion: '' });
          break;

        case 'formulas':
          await createFormulaCalculada(formFormula);
          setFormFormula({ modeloId: '', variableId: '', expresion: '', orden: 0, activa: true });
          break;

        case 'valoresFijos':
          await createValorFijo(formValorFijo);
          setFormValorFijo({ clave: '', valor: '', descripcion: '' });
          break;

        case 'kits':
          await createKit(formKit);
          setFormKit({ codigo: '', descripcion: '' });
          break;
      }

      setSaveStatus('Guardado exitosamente');
      setShowForm(false);

      // Recargar datos
      await loadData();

      // Limpiar mensaje después de 2 segundos
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      setSaveStatus('Error al guardar: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  return (
    <div className="admin-bases-datos-page">
      <h1>Administración de Base de Datos</h1>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'vidrios' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('vidrios');
              setShowForm(false);
            }}
          >
            Vidrios
          </button>
          <button
            className={`tab-button ${activeTab === 'servicios' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('servicios');
              setShowForm(false);
            }}
          >
            Servicios
          </button>
          <button
            className={`tab-button ${activeTab === 'herrajes' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('herrajes');
              setShowForm(false);
            }}
          >
            Herrajes
          </button>
          <button
            className={`tab-button ${activeTab === 'accesorios' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('accesorios');
              setShowForm(false);
            }}
          >
            Accesorios
          </button>
          <button
            className={`tab-button ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('productos');
              setShowForm(false);
            }}
          >
            Productos
          </button>
          <button
            className={`tab-button ${activeTab === 'modelos' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('modelos');
              setShowForm(false);
            }}
          >
            Modelos
          </button>
          <button
            className={`tab-button ${activeTab === 'variablesCalculadas' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('variablesCalculadas');
              setShowForm(false);
            }}
          >
            Var. Calc.
          </button>
          <button
            className={`tab-button ${activeTab === 'formulas' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('formulas');
              setShowForm(false);
            }}
          >
            Fórmulas
          </button>
          <button
            className={`tab-button ${activeTab === 'valoresFijos' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('valoresFijos');
              setShowForm(false);
            }}
          >
            Val. Fijos
          </button>
          <button
            className={`tab-button ${activeTab === 'kits' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('kits');
              setShowForm(false);
            }}
          >
            Kits
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className={`save-status ${saveStatus.includes('Error') ? 'error' : 'success'}`}>
          {saveStatus}
        </div>
      )}

      <div className="tab-content">
        {/* Formulario de agregar */}
        {showForm && (
          <div className="add-form">
            <h3>Agregar {activeTab}</h3>

            {activeTab === 'vidrios' && (
              <div className="form-fields">
                <label>
                  Tipo:
                  <input
                    type="text"
                    value={formVidrio.tipo}
                    onChange={(e) => setFormVidrio({ ...formVidrio, tipo: e.target.value })}
                    placeholder="Ej: Float"
                  />
                </label>
                <label>
                  Color:
                  <input
                    type="text"
                    value={formVidrio.color}
                    onChange={(e) => setFormVidrio({ ...formVidrio, color: e.target.value })}
                    placeholder="Ej: Incoloro"
                  />
                </label>
              </div>
            )}

            {activeTab === 'servicios' && (
              <div className="form-fields">
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={formServicio.nombre}
                    onChange={(e) => setFormServicio({ nombre: e.target.value })}
                    placeholder="Ej: Fabricación e Instalación"
                  />
                </label>
              </div>
            )}

            {activeTab === 'herrajes' && (
              <div className="form-fields">
                <label>
                  Color:
                  <input
                    type="text"
                    value={formHerraje.color}
                    onChange={(e) => setFormHerraje({ color: e.target.value })}
                    placeholder="Ej: Natural"
                  />
                </label>
              </div>
            )}

            {activeTab === 'accesorios' && (
              <div className="form-fields">
                <label>
                  Descripción:
                  <input
                    type="text"
                    value={formAccesorio.descripcion}
                    onChange={(e) => setFormAccesorio({ descripcion: e.target.value })}
                    placeholder="Ej: Bisagra hidráulica"
                  />
                </label>
              </div>
            )}

            {activeTab === 'productos' && (
              <div className="form-fields">
                <label>
                  Línea:
                  <input
                    type="text"
                    value={formProducto.linea}
                    onChange={(e) => setFormProducto({ ...formProducto, linea: e.target.value })}
                    placeholder="Ej: Linea 1000"
                  />
                </label>
                <label>
                  Serie:
                  <input
                    type="text"
                    value={formProducto.serie}
                    onChange={(e) => setFormProducto({ ...formProducto, serie: e.target.value })}
                    placeholder="Ej: Serie A"
                  />
                </label>
                <label>
                  Modelo:
                  <input
                    type="text"
                    value={formProducto.modelo}
                    onChange={(e) => setFormProducto({ ...formProducto, modelo: e.target.value })}
                    placeholder="Ej: 1000-d"
                  />
                </label>
                <label>
                  Variables VI:
                  <input
                    type="text"
                    value={formProducto.varVi}
                    onChange={(e) => setFormProducto({ ...formProducto, varVi: e.target.value })}
                    placeholder="Ej: ALT1,VAN0"
                  />
                </label>
                <label>
                  Códigos IVI:
                  <input
                    type="text"
                    value={formProducto.codIvi}
                    onChange={(e) => setFormProducto({ ...formProducto, codIvi: e.target.value })}
                    placeholder="Ej: 1001.1002"
                  />
                </label>
                <label>
                  Espesor Vidrio:
                  <input
                    type="number"
                    value={formProducto.espVidrio}
                    onChange={(e) =>
                      setFormProducto({ ...formProducto, espVidrio: parseInt(e.target.value) || 6 })
                    }
                    placeholder="Ej: 6"
                  />
                </label>
              </div>
            )}

            {activeTab === 'modelos' && (
              <div className="form-fields">
                <label>
                  Código:
                  <input
                    type="text"
                    value={formModelo.codigo}
                    onChange={(e) => setFormModelo({ ...formModelo, codigo: e.target.value })}
                    placeholder="Ej: 1000-d"
                  />
                </label>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={formModelo.nombre}
                    onChange={(e) => setFormModelo({ ...formModelo, nombre: e.target.value })}
                    placeholder="Ej: Modelo 1000-d"
                  />
                </label>
              </div>
            )}

            {activeTab === 'variablesCalculadas' && (
              <div className="form-fields">
                <label>
                  Código:
                  <input
                    type="text"
                    value={formVariableCalculada.codigo}
                    onChange={(e) => setFormVariableCalculada({ ...formVariableCalculada, codigo: e.target.value })}
                    placeholder="Ej: CAR1"
                  />
                </label>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={formVariableCalculada.nombre}
                    onChange={(e) => setFormVariableCalculada({ ...formVariableCalculada, nombre: e.target.value })}
                    placeholder="Ej: Carpintería 1"
                  />
                </label>
                <label>
                  Descripción (opcional):
                  <input
                    type="text"
                    value={formVariableCalculada.descripcion}
                    onChange={(e) => setFormVariableCalculada({ ...formVariableCalculada, descripcion: e.target.value })}
                    placeholder="Ej: Medida de carpintería"
                  />
                </label>
              </div>
            )}

            {activeTab === 'formulas' && (
              <div className="form-fields">
                <label>
                  Modelo ID:
                  <input
                    type="text"
                    value={formFormula.modeloId}
                    onChange={(e) => setFormFormula({ ...formFormula, modeloId: e.target.value })}
                    placeholder="UUID del modelo"
                  />
                </label>
                <label>
                  Variable ID:
                  <input
                    type="text"
                    value={formFormula.variableId}
                    onChange={(e) => setFormFormula({ ...formFormula, variableId: e.target.value })}
                    placeholder="UUID de la variable"
                  />
                </label>
                <label>
                  Expresión:
                  <input
                    type="text"
                    value={formFormula.expresion}
                    onChange={(e) => setFormFormula({ ...formFormula, expresion: e.target.value })}
                    placeholder="Ej: ALT1 + VAN0"
                  />
                </label>
                <label>
                  Orden:
                  <input
                    type="number"
                    value={formFormula.orden}
                    onChange={(e) => setFormFormula({ ...formFormula, orden: parseInt(e.target.value) || 0 })}
                    placeholder="Ej: 1"
                  />
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formFormula.activa}
                    onChange={(e) => setFormFormula({ ...formFormula, activa: e.target.checked })}
                  />
                  Activa
                </label>
              </div>
            )}

            {activeTab === 'valoresFijos' && (
              <div className="form-fields">
                <label>
                  Clave:
                  <input
                    type="text"
                    value={formValorFijo.clave}
                    onChange={(e) => setFormValorFijo({ ...formValorFijo, clave: e.target.value })}
                    placeholder="Ej: MARGEN"
                  />
                </label>
                <label>
                  Valor:
                  <input
                    type="text"
                    value={formValorFijo.valor}
                    onChange={(e) => setFormValorFijo({ ...formValorFijo, valor: e.target.value })}
                    placeholder="Ej: 1.5"
                  />
                </label>
                <label>
                  Descripción (opcional):
                  <input
                    type="text"
                    value={formValorFijo.descripcion}
                    onChange={(e) => setFormValorFijo({ ...formValorFijo, descripcion: e.target.value })}
                    placeholder="Ej: Margen de ganancia"
                  />
                </label>
              </div>
            )}

            {activeTab === 'kits' && (
              <div className="form-fields">
                <label>
                  Código:
                  <input
                    type="text"
                    value={formKit.codigo}
                    onChange={(e) => setFormKit({ ...formKit, codigo: e.target.value })}
                    placeholder="Ej: KIT001"
                  />
                </label>
                <label>
                  Descripción:
                  <input
                    type="text"
                    value={formKit.descripcion}
                    onChange={(e) => setFormKit({ ...formKit, descripcion: e.target.value })}
                    placeholder="Ej: Kit de instalación básico"
                  />
                </label>
              </div>
            )}

            <div className="form-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSave}>
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Tablas de datos */}
        {activeTab === 'vidrios' && (
          <div className="tab-panel">
            <h2>Vidrios</h2>
            <DataTable
              data={vidriosData.data}
              columns={[
                { key: 'tipo', label: 'Tipo' },
                { key: 'color', label: 'Color' },
              ]}
              loading={vidriosLoading}
              error={vidriosError}
              page={vidriosData.page}
              totalPages={vidriosData.totalPages}
              total={vidriosData.total}
              onPageChange={setVidriosPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}

        {activeTab === 'servicios' && (
          <div className="tab-panel">
            <h2>Servicios</h2>
            <DataTable
              data={serviciosData.data}
              columns={[{ key: 'nombre', label: 'Nombre' }]}
              loading={serviciosLoading}
              error={serviciosError}
              page={serviciosData.page}
              totalPages={serviciosData.totalPages}
              total={serviciosData.total}
              onPageChange={setServiciosPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}

        {activeTab === 'herrajes' && (
          <div className="tab-panel">
            <h2>Herrajes</h2>
            <DataTable
              data={herrajesData.data}
              columns={[{ key: 'color', label: 'Color' }]}
              loading={herrajesLoading}
              error={herrajesError}
              page={herrajesData.page}
              totalPages={herrajesData.totalPages}
              total={herrajesData.total}
              onPageChange={setHerrajesPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}

        {activeTab === 'accesorios' && (
          <div className="tab-panel">
            <h2>Accesorios</h2>
            <DataTable
              data={accesoriosData.data}
              columns={[{ key: 'descripcion', label: 'Descripción' }]}
              loading={accesoriosLoading}
              error={accesoriosError}
              page={accesoriosData.page}
              totalPages={accesoriosData.totalPages}
              total={accesoriosData.total}
              onPageChange={setAccesoriosPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}

        {activeTab === 'productos' && (
          <div className="tab-panel">
            <h2>Productos</h2>
            <DataTable
              data={productosData.data}
              columns={[
                { key: 'linea', label: 'Línea' },
                { key: 'serie', label: 'Serie' },
                { key: 'modelo', label: 'Modelo' },
                { key: 'varVi', label: 'Var. Vidrio' },
                { key: 'codIvi', label: 'Cód. IVI' },
                { key: 'espVidrio', label: 'Esp. Vidrio' },
              ]}
              loading={productosLoading}
              error={productosError}
              page={productosData.page}
              totalPages={productosData.totalPages}
              total={productosData.total}
              onPageChange={setProductosPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}

        {activeTab === 'modelos' && (
          <div className="tab-panel">
            <h2>Modelos</h2>
            <DataTable
              data={modelosData.data}
              columns={[
                { key: 'codigo', label: 'Código' },
                { key: 'nombre', label: 'Nombre' },
              ]}
              loading={modelosLoading}
              error={modelosError}
              page={modelosData.page}
              totalPages={modelosData.totalPages}
              total={modelosData.total}
              onPageChange={setModelosPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}

        {activeTab === 'variablesCalculadas' && (
          <div className="tab-panel">
            <h2>Variables Calculadas</h2>
            <DataTable
              data={variablesCalculadasData.data}
              columns={[
                { key: 'codigo', label: 'Código' },
                { key: 'nombre', label: 'Nombre' },
                { key: 'descripcion', label: 'Descripción' },
              ]}
              loading={variablesCalculadasLoading}
              error={variablesCalculadasError}
              page={variablesCalculadasData.page}
              totalPages={variablesCalculadasData.totalPages}
              total={variablesCalculadasData.total}
              onPageChange={setVariablesCalculadasPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}

        {activeTab === 'formulas' && (
          <div className="tab-panel">
            <h2>Fórmulas Calculadas</h2>
            <DataTable
              data={formulasData.data}
              columns={[
                { key: 'expresion', label: 'Expresión' },
                { key: 'orden', label: 'Orden' },
                { key: 'activa', label: 'Activa' },
              ]}
              loading={formulasLoading}
              error={formulasError}
              page={formulasData.page}
              totalPages={formulasData.totalPages}
              total={formulasData.total}
              onPageChange={setFormulasPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}

        {activeTab === 'valoresFijos' && (
          <div className="tab-panel">
            <h2>Valores Fijos</h2>
            <DataTable
              data={valoresFijosData.data}
              columns={[
                { key: 'clave', label: 'Clave' },
                { key: 'valor', label: 'Valor' },
                { key: 'descripcion', label: 'Descripción' },
              ]}
              loading={valoresFijosLoading}
              error={valoresFijosError}
              page={valoresFijosData.page}
              totalPages={valoresFijosData.totalPages}
              total={valoresFijosData.total}
              onPageChange={setValoresFijosPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}

        {activeTab === 'kits' && (
          <div className="tab-panel">
            <h2>Kits</h2>
            <DataTable
              data={kitsData.data}
              columns={[
                { key: 'codigo', label: 'Código' },
                { key: 'descripcion', label: 'Descripción' },
              ]}
              loading={kitsLoading}
              error={kitsError}
              page={kitsData.page}
              totalPages={kitsData.totalPages}
              total={kitsData.total}
              onPageChange={setKitsPage}
              onAddNew={handleAddNew}
            />
          </div>
        )}
      </div>
    </div>
  );
}
