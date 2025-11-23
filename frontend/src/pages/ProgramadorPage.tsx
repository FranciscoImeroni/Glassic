import { useState } from 'react';
import ImageBulkUpload from '../components/ImageBulkUpload/ImageBulkUpload';
import AdminBasesDeDatosPage from './AdminBasesDeDatosPage/AdminBasesDeDatosPage';
import './ProgramadorPage.css';

type TabType = 'imagenes' | 'basesdatos' | 'configuracion' | 'avanzado';

export default function ProgramadorPage() {
  const [activeTab, setActiveTab] = useState<TabType>('imagenes');

  return (
    <div className="programador-page">
      <h1>Administrador</h1>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'imagenes' ? 'active' : ''}`}
            onClick={() => setActiveTab('imagenes')}
          >
            Carga de Imágenes
          </button>
          <button
            className={`tab-button ${activeTab === 'basesdatos' ? 'active' : ''}`}
            onClick={() => setActiveTab('basesdatos')}
          >
            Base de Datos
          </button>
          <button
            className={`tab-button ${activeTab === 'configuracion' ? 'active' : ''}`}
            onClick={() => setActiveTab('configuracion')}
          >
            Configuración
          </button>
          <button
            className={`tab-button ${activeTab === 'avanzado' ? 'active' : ''}`}
            onClick={() => setActiveTab('avanzado')}
          >
            Herramientas Avanzadas
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'imagenes' && (
          <div className="tab-panel">
            <ImageBulkUpload />
          </div>
        )}

        {activeTab === 'basesdatos' && (
          <div className="tab-panel">
            <AdminBasesDeDatosPage />
          </div>
        )}

        {activeTab === 'configuracion' && (
          <div className="tab-panel">
            <div className="placeholder-content">
              <p>Configuración del sistema</p>
              <p>(Próximamente)</p>
            </div>
          </div>
        )}

        {activeTab === 'avanzado' && (
          <div className="tab-panel">
            <div className="placeholder-content">
              <p>Herramientas y opciones avanzadas</p>
              <p>(Próximamente)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}