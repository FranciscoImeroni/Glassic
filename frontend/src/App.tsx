import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import FormPage from './pages/FormPage/FormPage';
import MainLayout from './layouts/MainLayout';
import IngresarProductoPage from './pages/IngresarProductoPage';
import VerPlanoPage from './pages/VerPlanoPage';
import VerFormulasPage from './pages/VerFormulasPage';
import BasesDeDatosPage from './pages/BasesDeDatosPage';
import LimpiarDatosPage from './pages/LimpiarDatosPage';
import SalirPage from './pages/SalirPage';
import ProgramadorPage from './pages/ProgramadorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/ingresar-datos" replace />} />
          <Route path="/ingresar-datos" element={<FormPage />} />
          <Route path="/ingresar-producto" element={<IngresarProductoPage />} />
          <Route path="/ver-plano" element={<VerPlanoPage />} />
          <Route path="/ver-formulas" element={<VerFormulasPage />} />
          <Route path="/bases-de-datos" element={<BasesDeDatosPage />} />
          <Route path="/limpiar-datos" element={<LimpiarDatosPage />} />
          <Route path="/salir" element={<SalirPage />} />
          <Route path="/programador" element={<ProgramadorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
