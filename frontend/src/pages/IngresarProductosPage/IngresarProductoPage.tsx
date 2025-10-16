import { useState } from 'react';
import './IngresarProductoPage.css';

export default function IngresarProductoPage() {
  const [formData, setFormData] = useState({
    linea: '',
    serie: '',
    modelo: '',
    medidas: Array(10).fill(''),
    espesorVidrio: ''
  });

  const lineas = ['Linea 1000', 'Linea 4000'];
  const series = ['Panel', 'Panel Angulo', 'Box Frontal', 'Box Esquinero', 'Box Angular'];
  const espesores = ['6', '8', '10', '12'];


  //Falta hacer botones de info para cada campo

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMedidaChange = (index: number, value: string) => {
    const newMedidas = [...formData.medidas];
    newMedidas[index] = value;
    setFormData(prev => ({
      ...prev,
      medidas: newMedidas
    }));
  };

  const handleAplicar = () => {
    console.log('Datos del formulario:', formData);
    // Aquí iría la lógica para procesar el formulario
  };

  return (
    <div className="ingresar-producto-container">
      <h1 className="page-title">INGRESAR PRODUCTO</h1>
      <div className="producto-form">
        <div className="form-header">
          <div className="form-fields">
            <div className="field-group">
              <label>LINEA:</label>
              <select 
                value={formData.linea}
                onChange={(e) => handleInputChange('linea', e.target.value)}
                className="dropdown"
              >
                <option value=""></option>
                {lineas.map(linea => (
                  <option key={linea} value={linea}>{linea}</option>
                ))}
              </select>
            </div>
            
            <div className="field-group">
              <label>SERIE:</label>
              <select 
                value={formData.serie}
                onChange={(e) => handleInputChange('serie', e.target.value)}
                className="dropdown"
              >
                <option value=""></option>
                {series.map(serie => (
                  <option key={serie} value={serie}>{serie}</option>
                ))}
              </select>
            </div>
            
            <div className="field-group">
              <label>MODELO:</label>
              <select 
                value={formData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                className="dropdown"
              >
                <option value=""></option>
                <option value="1000">1000</option>
                <option value="1010-i">1010-i</option>
                <option value="1010-d">1010-d</option>
                <option value="4000-Ai">4000-Ai</option>
                <option value="4200-A1i">4200-A1i</option>
              </select>
            </div>
          </div>
          
          <button className="aplicar-btn" onClick={handleAplicar}>
            APLICAR
          </button>
        </div>

        <div className="form-content">
          <div className="imagen-section">
            <div className="imagen-placeholder">
            </div>
          </div>

          <div className="medidas-section">
            <h3>MEDIDAS EN mm:</h3>
            <div className="medidas-grid">
              {formData.medidas.map((medida, index) => (
                <input
                  key={index}
                  type="number"
                  value={medida}
                  onChange={(e) => handleMedidaChange(index, e.target.value)}
                  className="medida-input"
                />
              ))}
            </div>

            <div className="espesor-section">
              <label>ESPESOR VIDRIO:</label>
              <select 
                value={formData.espesorVidrio}
                onChange={(e) => handleInputChange('espesorVidrio', e.target.value)}
                className="espesor-dropdown"
              >
                <option value=""></option>
                {espesores.map(espesor => (
                  <option key={espesor} value={espesor}>{espesor}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}