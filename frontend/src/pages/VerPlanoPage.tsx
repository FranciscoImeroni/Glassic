import { getOrdenFabricacionUrl } from '../utils/cloudinary';
import './VerPlanoPage.css';

export default function VerPlanoPage() {
  return (
    <div className="ver-plano-container">
      <img
        src={getOrdenFabricacionUrl({ width: 1920 })}
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
  );
}