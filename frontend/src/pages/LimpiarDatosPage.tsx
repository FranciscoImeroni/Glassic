import { useProducto } from '../context/ProductoContext';
import { useNavigate } from 'react-router-dom';

export default function LimpiarDatosPage() {
  const { limpiarTodo } = useProducto();
  const navigate = useNavigate();

  const handleLimpiar = () => {
    if (window.confirm('¿Estás seguro que deseas limpiar todos los datos ingresados?')) {
      limpiarTodo();
      alert('Datos limpiados correctamente');
      navigate('/');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Limpiar Datos</h1>
      <p style={{ marginBottom: '2rem' }}>
        Esta acción borrará todos los datos ingresados (producto, medidas, datos del cliente).
      </p>
      <button
        onClick={handleLimpiar}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Limpiar Todos los Datos
      </button>
    </div>
  );
}