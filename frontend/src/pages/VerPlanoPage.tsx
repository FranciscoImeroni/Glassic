import { getOrdenFabricacionUrl } from '../utils/cloudinary';
import './VerPlanoPage.css';

export default function VerPlanoPage() {
  return (
    <div className="ver-plano-container">
      <h1 className="page-title">VER PLANO</h1>

      <div className="plano-content">
        <div className="orden-fabricacion-section">
          <h2>Orden de Fabricación</h2>
          <div className="orden-image-container">
            <img
              src={getOrdenFabricacionUrl({ width: 1200 })}
              alt="Orden de Fabricación"
              className="orden-fabricacion-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  container.innerHTML = '<p class="error-message">Imagen de orden de fabricación no disponible</p>';
                }
              }}
            />
          </div>

          <div className="plano-info">
            <p className="info-text">
              Esta plantilla se utilizará para generar órdenes de fabricación con la información del producto,
              incluyendo esquemas, planos y datos ingresados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}