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
} from '../api';
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
} from '../api';
import './BasesDeDatosPage.css';

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
}

function DataTable<T>({ data, columns, loading, error, page, totalPages, total, onPageChange }: DataTableProps<T>) {
  if (loading) {
    return <div className="loading-message">Cargando datos...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // Manejo defensivo: asegurar que data sea un array válido
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return <div className="empty-message">No hay datos para mostrar</div>;
  }

  const startRecord = (page - 1) * 20 + 1;
  const endRecord = Math.min(page * 20, total);
  const showPagination = totalPages > 1;

  return (
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
            {safeData.map((row, idx) => (
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
  );
}

export default function BasesDeDatosPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vidrios');

  // Función genérica para crear estados
  const createState = <T,>() => {
    const [data, setData] = useState<PaginatedResponse<T>>({ data: [], total: 0, page: 1, totalPages: 0 });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    return { data, setData, page, setPage, loading, setLoading, error, setError };
  };

  const vidrios = createState<Vidrio>();
  const servicios = createState<Servicio>();
  const herrajes = createState<Herraje>();
  const accesorios = createState<Accesorio>();
  const productos = createState<Producto>();
  const modelos = createState<Modelo>();
  const variablesCalculadas = createState<VariableCalculada>();
  const formulas = createState<FormulaCalculada>();
  const valoresFijos = createState<ValorFijo>();
  const kits = createState<Kit>();

  // Función de carga genérica
  const loadData = async <T,>(
    loader: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
    state: ReturnType<typeof createState<T>>,
    tab: TabType
  ) => {
    if (activeTab !== tab) return;

    state.setLoading(true);
    state.setError(null);
    try {
      const result = await loader(state.page, 20);
      state.setData(result);
    } catch (err) {
      state.setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      state.setLoading(false);
    }
  };

  useEffect(() => { loadData(getVidriosPaginated, vidrios, 'vidrios'); }, [activeTab, vidrios.page]);
  useEffect(() => { loadData(getServiciosPaginated, servicios, 'servicios'); }, [activeTab, servicios.page]);
  useEffect(() => { loadData(getHerrajesPaginated, herrajes, 'herrajes'); }, [activeTab, herrajes.page]);
  useEffect(() => { loadData(getAccesoriosPaginated, accesorios, 'accesorios'); }, [activeTab, accesorios.page]);
  useEffect(() => { loadData(getProductosPaginated, productos, 'productos'); }, [activeTab, productos.page]);
  useEffect(() => { loadData(getModelosPaginated, modelos, 'modelos'); }, [activeTab, modelos.page]);
  useEffect(() => { loadData(getVariablesCalculadasPaginated, variablesCalculadas, 'variablesCalculadas'); }, [activeTab, variablesCalculadas.page]);
  useEffect(() => { loadData(getFormulasCalculadasPaginated, formulas, 'formulas'); }, [activeTab, formulas.page]);
  useEffect(() => { loadData(getValoresFijosPaginated, valoresFijos, 'valoresFijos'); }, [activeTab, valoresFijos.page]);
  useEffect(() => { loadData(getKitsPaginated, kits, 'kits'); }, [activeTab, kits.page]);

  return (
    <div className="bases-datos-page">
      <h1>Bases de Datos</h1>

      <div className="tabs-container">
        <div className="tabs">
          <button className={`tab-button ${activeTab === 'vidrios' ? 'active' : ''}`} onClick={() => setActiveTab('vidrios')}>
            Vidrios
          </button>
          <button className={`tab-button ${activeTab === 'servicios' ? 'active' : ''}`} onClick={() => setActiveTab('servicios')}>
            Servicios
          </button>
          <button className={`tab-button ${activeTab === 'herrajes' ? 'active' : ''}`} onClick={() => setActiveTab('herrajes')}>
            Herrajes
          </button>
          <button className={`tab-button ${activeTab === 'accesorios' ? 'active' : ''}`} onClick={() => setActiveTab('accesorios')}>
            Accesorios
          </button>
          <button className={`tab-button ${activeTab === 'productos' ? 'active' : ''}`} onClick={() => setActiveTab('productos')}>
            Productos
          </button>
          <button className={`tab-button ${activeTab === 'modelos' ? 'active' : ''}`} onClick={() => setActiveTab('modelos')}>
            Modelos
          </button>
          <button className={`tab-button ${activeTab === 'variablesCalculadas' ? 'active' : ''}`} onClick={() => setActiveTab('variablesCalculadas')}>
            Variables Calc.
          </button>
          <button className={`tab-button ${activeTab === 'formulas' ? 'active' : ''}`} onClick={() => setActiveTab('formulas')}>
            Fórmulas
          </button>
          <button className={`tab-button ${activeTab === 'valoresFijos' ? 'active' : ''}`} onClick={() => setActiveTab('valoresFijos')}>
            Valores Fijos
          </button>
          <button className={`tab-button ${activeTab === 'kits' ? 'active' : ''}`} onClick={() => setActiveTab('kits')}>
            Kits
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'vidrios' && (
          <div className="tab-panel">
            <h2>Vidrios</h2>
            <DataTable
              data={vidrios.data.data}
              columns={[{ key: 'tipo', label: 'Tipo' }, { key: 'color', label: 'Color' }]}
              loading={vidrios.loading}
              error={vidrios.error}
              page={vidrios.data.page}
              totalPages={vidrios.data.totalPages}
              total={vidrios.data.total}
              onPageChange={vidrios.setPage}
            />
          </div>
        )}

        {activeTab === 'servicios' && (
          <div className="tab-panel">
            <h2>Servicios</h2>
            <DataTable
              data={servicios.data.data}
              columns={[{ key: 'nombre', label: 'Nombre' }]}
              loading={servicios.loading}
              error={servicios.error}
              page={servicios.data.page}
              totalPages={servicios.data.totalPages}
              total={servicios.data.total}
              onPageChange={servicios.setPage}
            />
          </div>
        )}

        {activeTab === 'herrajes' && (
          <div className="tab-panel">
            <h2>Herrajes</h2>
            <DataTable
              data={herrajes.data.data}
              columns={[{ key: 'color', label: 'Color' }]}
              loading={herrajes.loading}
              error={herrajes.error}
              page={herrajes.data.page}
              totalPages={herrajes.data.totalPages}
              total={herrajes.data.total}
              onPageChange={herrajes.setPage}
            />
          </div>
        )}

        {activeTab === 'accesorios' && (
          <div className="tab-panel">
            <h2>Accesorios</h2>
            <DataTable
              data={accesorios.data.data}
              columns={[{ key: 'descripcion', label: 'Descripción' }]}
              loading={accesorios.loading}
              error={accesorios.error}
              page={accesorios.data.page}
              totalPages={accesorios.data.totalPages}
              total={accesorios.data.total}
              onPageChange={accesorios.setPage}
            />
          </div>
        )}

        {activeTab === 'productos' && (
          <div className="tab-panel">
            <h2>Productos</h2>
            <DataTable
              data={productos.data.data}
              columns={[
                { key: 'linea', label: 'Línea' },
                { key: 'serie', label: 'Serie' },
                { key: 'modelo', label: 'Modelo' },
                { key: 'varVi', label: 'Var. Vidrio' },
                { key: 'codIvi', label: 'Cód. IVI' },
                { key: 'espVidrio', label: 'Esp. Vidrio' },
              ]}
              loading={productos.loading}
              error={productos.error}
              page={productos.data.page}
              totalPages={productos.data.totalPages}
              total={productos.data.total}
              onPageChange={productos.setPage}
            />
          </div>
        )}

        {activeTab === 'modelos' && (
          <div className="tab-panel">
            <h2>Modelos</h2>
            <DataTable
              data={modelos.data.data}
              columns={[
                { key: 'codigo', label: 'Código' },
                { key: 'nombre', label: 'Nombre' },
              ]}
              loading={modelos.loading}
              error={modelos.error}
              page={modelos.data.page}
              totalPages={modelos.data.totalPages}
              total={modelos.data.total}
              onPageChange={modelos.setPage}
            />
          </div>
        )}

        {activeTab === 'variablesCalculadas' && (
          <div className="tab-panel">
            <h2>Variables Calculadas</h2>
            <DataTable
              data={variablesCalculadas.data.data}
              columns={[
                { key: 'codigo', label: 'Código' },
                { key: 'nombre', label: 'Nombre' },
                { key: 'descripcion', label: 'Descripción' },
              ]}
              loading={variablesCalculadas.loading}
              error={variablesCalculadas.error}
              page={variablesCalculadas.data.page}
              totalPages={variablesCalculadas.data.totalPages}
              total={variablesCalculadas.data.total}
              onPageChange={variablesCalculadas.setPage}
            />
          </div>
        )}

        {activeTab === 'formulas' && (
          <div className="tab-panel">
            <h2>Fórmulas Calculadas</h2>
            <DataTable
              data={formulas.data.data}
              columns={[
                { key: 'expresion', label: 'Expresión' },
                { key: 'orden', label: 'Orden' },
                { key: 'activa', label: 'Activa' },
              ]}
              loading={formulas.loading}
              error={formulas.error}
              page={formulas.data.page}
              totalPages={formulas.data.totalPages}
              total={formulas.data.total}
              onPageChange={formulas.setPage}
            />
          </div>
        )}

        {activeTab === 'valoresFijos' && (
          <div className="tab-panel">
            <h2>Valores Fijos</h2>
            <DataTable
              data={valoresFijos.data.data}
              columns={[
                { key: 'clave', label: 'Clave' },
                { key: 'valor', label: 'Valor' },
                { key: 'descripcion', label: 'Descripción' },
              ]}
              loading={valoresFijos.loading}
              error={valoresFijos.error}
              page={valoresFijos.data.page}
              totalPages={valoresFijos.data.totalPages}
              total={valoresFijos.data.total}
              onPageChange={valoresFijos.setPage}
            />
          </div>
        )}

        {activeTab === 'kits' && (
          <div className="tab-panel">
            <h2>Kits</h2>
            <DataTable
              data={kits.data.data}
              columns={[
                { key: 'codigo', label: 'Código' },
                { key: 'descripcion', label: 'Descripción' },
              ]}
              loading={kits.loading}
              error={kits.error}
              page={kits.data.page}
              totalPages={kits.data.totalPages}
              total={kits.data.total}
              onPageChange={kits.setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
