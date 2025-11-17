import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormPage from './pages/FormPage/FormPage';
import MainLayout from './layouts/MainLayout';
import IngresarProductoPage from './pages/IngresarProductosPage/IngresarProductoPage';
import VerPlanoPage from './pages/VerPlanoPage';
import VerFormulasPage from './pages/VerFormulasPage';
import BasesDeDatosPage from './pages/BasesDeDatosPage';
import LimpiarDatosPage from './pages/LimpiarDatosPage';
import SalirPage from './pages/SalirPage';
import ProgramadorPage from './pages/ProgramadorPage';
import HomePage from './pages/HomePage/HomePage';
import ConfigurarPlantillaPage from './pages/ConfigurarPlantillaPage/ConfigurarPlantillaPage';
import ConfigurarPlanoPage from './pages/ConfigurarPlanoPage/ConfigurarPlanoPage';
import { ProductoProvider } from './context/ProductoContext';

function App() {
  return (
    <ProductoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ingresar-datos" element={<FormPage />} />
            <Route path="/ingresar-producto" element={<IngresarProductoPage />} />
            <Route path="/ver-plano" element={<VerPlanoPage />} />
            <Route path="/ver-formulas" element={<VerFormulasPage />} />
            <Route path="/bases-de-datos" element={<BasesDeDatosPage />} />
            <Route path="/limpiar-datos" element={<LimpiarDatosPage />} />
            <Route path="/salir" element={<SalirPage />} />
            <Route path="/programador" element={<ProgramadorPage />} />
            <Route path="/config/plantilla" element={<ConfigurarPlantillaPage />} />
            <Route path="/config/plano" element={<ConfigurarPlanoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProductoProvider>
  );
}

export default App;
