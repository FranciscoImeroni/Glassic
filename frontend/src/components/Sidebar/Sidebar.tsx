import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../assets/glassic-logo.png'; // Ajusta el nombre del archivo según tu logo

const menuItems = [
  { label: 'INGRESAR DATOS', to: '/ingresar-datos' },
  { label: 'INGRESAR PRODUCTO', to: '/ingresar-producto' },
  { label: 'VER  PLANO', to: '/ver-plano' },
  { label: 'VER  FORMULAS', to: '/ver-formulas' },
  { label: 'BASES DE DATOS', to: '/bases-de-datos' },
  { label: 'LIMPIAR DATOS', to: '/limpiar-datos' },
  { label: 'SALIR', to: '/salir' },
  { label: 'PROGRAMADOR', to: '/programador' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Glassic Logo" className="brand-logo" />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}