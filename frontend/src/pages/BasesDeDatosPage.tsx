import { useState } from 'react';
import ImageBulkUpload from '../components/ImageBulkUpload/ImageBulkUpload';
import './BasesDeDatosPage.css';

type TabType = 'imagenes' | 'productos' | 'configuracion';

export default function BasesDeDatosPage() {
  const [activeTab, setActiveTab] = useState<TabType>('imagenes');

  return (
    <div className="bases-datos-page">
      <h1>Administración de Bases de Datos</h1>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'imagenes' ? 'active' : ''}`}
            onClick={() => setActiveTab('imagenes')}
          >
            Imágenes
          </button>
          <button
            className={`tab-button ${activeTab === 'productos' ? 'active' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            Productos
          </button>
          <button
            className={`tab-button ${activeTab === 'configuracion' ? 'active' : ''}`}
            onClick={() => setActiveTab('configuracion')}
          >
            Configuración
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'imagenes' && (
          <div className="tab-panel">
            <ImageBulkUpload />
          </div>
        )}

        {activeTab === 'productos' && (
          <div className="tab-panel">
            <div className="placeholder-content">
              <p>Gestión de productos</p>
              <p>(Próximamente)</p>
            </div>
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
      </div>
    </div>
  );
}