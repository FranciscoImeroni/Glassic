import { useState, useEffect } from 'react';
import type {
  Comprobante,
  Vidrio,
  Servicio,
  Herraje,
  Accesorio,
  Producto,
  PaginatedResponse,
} from '../../api';
import {
  getComprobantesPaginated,
  getVidriosPaginated,
  getServiciosPaginated,
  getHerrajesPaginated,
  getAccesoriosPaginated,
  getProductosPaginated,
  createComprobante,
  createVidrio,
  createServicio,
  createHerraje,
  createAccesorio,
  createProducto,
} from '../../api';
import './AdminBasesDeDatosPage.css';

type TabType = 'comprobantes' | 'vidrios' | 'servicios' | 'herrajes' | 'accesorios' | 'productos';

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

  // Estados para Comprobantes
  const [comprobantesData, setComprobantesData] = useState<PaginatedResponse<Comprobante>>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [comprobantesPage, setComprobantesPage] = useState(1);
  const [comprobantesLoading, setComprobantesLoading] = useState(false);
  const [comprobantesError, setComprobantesError] = useState<string | null>(null);
  const [formComprobante, setFormComprobante] = useState({ codigo: '', descripcion: '' });

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

  // Cargar datos según el tab activo
  const loadData = async () => {
    switch (activeTab) {
      case 'comprobantes':
        setComprobantesLoading(true);
        setComprobantesError(null);
        try {
          const result = await getComprobantesPaginated(comprobantesPage, 20);
          setComprobantesData(result);
        } catch (err) {
          setComprobantesError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setComprobantesLoading(false);
        }
        break;

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
    }
  };

  useEffect(() => {
    loadData();
  }, [
    activeTab,
    comprobantesPage,
    vidriosPage,
    serviciosPage,
    herrajesPage,
    accesoriosPage,
    productosPage,
  ]);

  const handleAddNew = () => {
    setShowForm(true);
    setSaveStatus('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setSaveStatus('');
    // Limpiar formularios
    setFormComprobante({ codigo: '', descripcion: '' });
    setFormVidrio({ tipo: '', color: '' });
    setFormServicio({ nombre: '' });
    setFormHerraje({ color: '' });
    setFormAccesorio({ descripcion: '' });
    setFormProducto({ linea: '', serie: '', modelo: '', varVi: '', codIvi: '', espVidrio: 6 });
  };

  const handleSave = async () => {
    try {
      setSaveStatus('Guardando...');

      switch (activeTab) {
        case 'comprobantes':
          await createComprobante(formComprobante);
          setFormComprobante({ codigo: '', descripcion: '' });
          break;

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
            className={`tab-button ${activeTab === 'comprobantes' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('comprobantes');
              setShowForm(false);
            }}
          >
            Comprobantes
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

            {activeTab === 'comprobantes' && (
              <div className="form-fields">
                <label>
                  Código:
                  <input
                    type="text"
                    value={formComprobante.codigo}
                    onChange={(e) =>
                      setFormComprobante({ ...formComprobante, codigo: e.target.value })
                    }
                    placeholder="Ej: NP"
                  />
                </label>
                <label>
                  Descripción:
                  <input
                    type="text"
                    value={formComprobante.descripcion}
                    onChange={(e) =>
                      setFormComprobante({ ...formComprobante, descripcion: e.target.value })
                    }
                    placeholder="Ej: Nota de Pedido"
                  />
                </label>
              </div>
            )}

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

        {activeTab === 'comprobantes' && (
          <div className="tab-panel">
            <h2>Comprobantes</h2>
            <DataTable
              data={comprobantesData.data}
              columns={[
                { key: 'codigo', label: 'Código' },
                { key: 'descripcion', label: 'Descripción' },
              ]}
              loading={comprobantesLoading}
              error={comprobantesError}
              page={comprobantesData.page}
              totalPages={comprobantesData.totalPages}
              total={comprobantesData.total}
              onPageChange={setComprobantesPage}
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
      </div>
    </div>
  );
}
