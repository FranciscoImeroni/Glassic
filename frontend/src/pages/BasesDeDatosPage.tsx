import { useState, useEffect } from 'react';
import {
  Comprobante,
  Vidrio,
  Servicio,
  Herraje,
  Accesorio,
  PaginatedResponse,
  getComprobantesPaginated,
  getVidriosPaginated,
  getServiciosPaginated,
  getHerrajesPaginated,
  getAccesoriosPaginated,
} from '../api';
import './BasesDeDatosPage.css';

type TabType = 'comprobantes' | 'vidrios' | 'servicios' | 'herrajes' | 'accesorios';

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

  if (data.length === 0) {
    return <div className="empty-message">No hay datos para mostrar</div>;
  }

  const startRecord = (page - 1) * 20 + 1;
  const endRecord = Math.min(page * 20, total);

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
    </>
  );
}

export default function BasesDeDatosPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vidrios');

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

  // Cargar Comprobantes
  useEffect(() => {
    const loadComprobantes = async () => {
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
    };

    if (activeTab === 'comprobantes') {
      loadComprobantes();
    }
  }, [activeTab, comprobantesPage]);

  // Cargar Vidrios
  useEffect(() => {
    const loadVidrios = async () => {
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
    };

    if (activeTab === 'vidrios') {
      loadVidrios();
    }
  }, [activeTab, vidriosPage]);

  // Cargar Servicios
  useEffect(() => {
    const loadServicios = async () => {
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
    };

    if (activeTab === 'servicios') {
      loadServicios();
    }
  }, [activeTab, serviciosPage]);

  // Cargar Herrajes
  useEffect(() => {
    const loadHerrajes = async () => {
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
    };

    if (activeTab === 'herrajes') {
      loadHerrajes();
    }
  }, [activeTab, herrajesPage]);

  // Cargar Accesorios
  useEffect(() => {
    const loadAccesorios = async () => {
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
    };

    if (activeTab === 'accesorios') {
      loadAccesorios();
    }
  }, [activeTab, accesoriosPage]);

  return (
    <div className="bases-datos-page">
      <h1>Bases de Datos</h1>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'vidrios' ? 'active' : ''}`}
            onClick={() => setActiveTab('vidrios')}
          >
            Vidrios
          </button>
          <button
            className={`tab-button ${activeTab === 'servicios' ? 'active' : ''}`}
            onClick={() => setActiveTab('servicios')}
          >
            Servicios
          </button>
          <button
            className={`tab-button ${activeTab === 'herrajes' ? 'active' : ''}`}
            onClick={() => setActiveTab('herrajes')}
          >
            Herrajes
          </button>
          <button
            className={`tab-button ${activeTab === 'accesorios' ? 'active' : ''}`}
            onClick={() => setActiveTab('accesorios')}
          >
            Accesorios
          </button>
          <button
            className={`tab-button ${activeTab === 'comprobantes' ? 'active' : ''}`}
            onClick={() => setActiveTab('comprobantes')}
          >
            Comprobantes
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'vidrios' && (
          <div className="tab-panel">
            <h2>Vidrios</h2>
            <DataTable
              data={vidriosData.data}
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'tipo', label: 'Tipo' },
                { key: 'color', label: 'Color' },
              ]}
              loading={vidriosLoading}
              error={vidriosError}
              page={vidriosData.page}
              totalPages={vidriosData.totalPages}
              total={vidriosData.total}
              onPageChange={setVidriosPage}
            />
          </div>
        )}

        {activeTab === 'servicios' && (
          <div className="tab-panel">
            <h2>Servicios</h2>
            <DataTable
              data={serviciosData.data}
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'nombre', label: 'Nombre' },
              ]}
              loading={serviciosLoading}
              error={serviciosError}
              page={serviciosData.page}
              totalPages={serviciosData.totalPages}
              total={serviciosData.total}
              onPageChange={setServiciosPage}
            />
          </div>
        )}

        {activeTab === 'herrajes' && (
          <div className="tab-panel">
            <h2>Herrajes</h2>
            <DataTable
              data={herrajesData.data}
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'color', label: 'Color' },
              ]}
              loading={herrajesLoading}
              error={herrajesError}
              page={herrajesData.page}
              totalPages={herrajesData.totalPages}
              total={herrajesData.total}
              onPageChange={setHerrajesPage}
            />
          </div>
        )}

        {activeTab === 'accesorios' && (
          <div className="tab-panel">
            <h2>Accesorios</h2>
            <DataTable
              data={accesoriosData.data}
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'descripcion', label: 'Descripción' },
              ]}
              loading={accesoriosLoading}
              error={accesoriosError}
              page={accesoriosData.page}
              totalPages={accesoriosData.totalPages}
              total={accesoriosData.total}
              onPageChange={setAccesoriosPage}
            />
          </div>
        )}

        {activeTab === 'comprobantes' && (
          <div className="tab-panel">
            <h2>Comprobantes</h2>
            <DataTable
              data={comprobantesData.data}
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'codigo', label: 'Código' },
                { key: 'descripcion', label: 'Descripción' },
              ]}
              loading={comprobantesLoading}
              error={comprobantesError}
              page={comprobantesData.page}
              totalPages={comprobantesData.totalPages}
              total={comprobantesData.total}
              onPageChange={setComprobantesPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
