import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducto } from '../../context/ProductoContext';
import {
  getComprobantes,
  getTiposVidrio,
  getColoresVidrio,
  getServicios,
  getHerrajes,
  getAccesorios,
  type Comprobante,
  type Servicio,
  type Herraje,
  type Accesorio,
} from '../../api/index';
import './FormPage.css';

export default function FormPage() {
  const navigate = useNavigate();
  const { datosCliente, setDatosCliente } = useProducto();

  type AccessoryItem = { cantidad: number; descripcion: string };

  // Estados del formulario - inicializar con datos del Context si existen
  const [cliente, setCliente] = useState(datosCliente.cliente || '');
  const [referencia, setReferencia] = useState(datosCliente.referencia || '');
  const [obra, setObra] = useState(datosCliente.obra || '');

  const [tipoComprobante, setTipoComprobante] = useState(datosCliente.comprobanteId || '');
  const [numeroComprobante, setNumeroComprobante] = useState(datosCliente.numeroComprobante || '');

  const [tipoVidrio, setTipoVidrio] = useState(datosCliente.vidrioId || '');
  const [colorVidrio, setColorVidrio] = useState(''); // Asumimos que vidrioId incluye tipo y color
  const [cantidadVidrio, setCantidadVidrio] = useState('');

  const [servicio, setServicio] = useState(datosCliente.servicioId || '');

  const [colorHerraje, setColorHerraje] = useState(datosCliente.herrajeId || '');

  const [accesorios, setAccesorios] = useState<AccessoryItem[]>(
    datosCliente.accesorios && datosCliente.accesorios.length > 0
      ? datosCliente.accesorios
      : [
          { cantidad: 0, descripcion: '' },
          { cantidad: 0, descripcion: '' },
          { cantidad: 0, descripcion: '' },
        ]
  );

  const [notaGeneral, setNotaGeneral] = useState(datosCliente.notas || '');
  const [status, setStatus] = useState('');

  // Estados para datos de la BD
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
  const [tiposVidrio, setTiposVidrio] = useState<string[]>([]);
  const [coloresVidrio, setColoresVidrio] = useState<string[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [herrajes, setHerrajes] = useState<Herraje[]>([]);
  const [accesoriosOptions, setAccesoriosOptions] = useState<Accesorio[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde la BD al montar el componente
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [comprobantesData, tiposData, coloresData, serviciosData, herrajesData, accesoriosData] =
          await Promise.all([
            getComprobantes(),
            getTiposVidrio(),
            getColoresVidrio(),
            getServicios(),
            getHerrajes(),
            getAccesorios(),
          ]);

        setComprobantes(comprobantesData);
        setTiposVidrio(tiposData);
        setColoresVidrio(coloresData);
        setServicios(serviciosData);
        setHerrajes(herrajesData);
        setAccesoriosOptions(accesoriosData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setStatus('Error al cargar datos de catálogos');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleAccessoryChange = (index: number, field: keyof AccessoryItem, value: string) => {
    setAccesorios((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [field]: field === 'cantidad' ? parseInt(value) || 0 : value }
          : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Obtener fecha actual
    const fecha = new Date().toISOString().split('T')[0];

    // Preparar datos para el Context
    const datosParaGuardar = {
      cliente,
      referencia,
      obra,
      comprobanteId: tipoComprobante,
      numeroComprobante,
      fecha,
      vidrioId: tipoVidrio, // Aquí deberías combinar tipo y color si es necesario
      servicioId: servicio,
      herrajeId: colorHerraje,
      accesorios: accesorios.filter(acc => acc.cantidad > 0 || acc.descripcion), // Filtrar vacíos
      notas: notaGeneral,
    };

    try {
      // Guardar en el Context
      setDatosCliente(datosParaGuardar);
      setStatus('Datos guardados correctamente. Redirigiendo...');

      // Navegar a ver plano
      setTimeout(() => {
        navigate('/ver-plano');
      }, 1000);
    } catch (err) {
      setStatus('Error al guardar datos');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="form-page">
        <header className="page-header">
          <h1>INGRESAR DATOS</h1>
        </header>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando catálogos...</div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <header className="page-header">
        <h1>INGRESAR DATOS</h1>
      </header>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-column">
          <section className="panel">
            <div className="panel-title">DATOS CLIENTE:</div>
            <div className="panel-body">
              <label>
                CLIENTE:
                <input value={cliente} onChange={(e) => setCliente(e.target.value)} />
              </label>
              <label>
                REFERENCIA:
                <input value={referencia} onChange={(e) => setReferencia(e.target.value)} />
              </label>
              <label>
                OBRA:
                <input value={obra} onChange={(e) => setObra(e.target.value)} />
              </label>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">COMPROBANTE:</div>
            <div className="panel-body">
              <label>
                TIPO:
                <select value={tipoComprobante} onChange={(e) => setTipoComprobante(e.target.value)}>
                  <option value="">Seleccione...</option>
                  {comprobantes.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.codigo} - {comp.descripcion}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                NUMERO:
                <input value={numeroComprobante} onChange={(e) => setNumeroComprobante(e.target.value)} />
              </label>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">VIDRIO:</div>
            <div className="panel-body">
              <label>
                TIPO:
                <select value={tipoVidrio} onChange={(e) => setTipoVidrio(e.target.value)}>
                  <option value="">Seleccione...</option>
                  {tiposVidrio.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                COLOR:
                <select value={colorVidrio} onChange={(e) => setColorVidrio(e.target.value)}>
                  <option value="">Seleccione...</option>
                  {coloresVidrio.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </label>
              <div className="row-inline">
                <label>
                  CANTIDAD:
                  <input
                    type="number"
                    value={cantidadVidrio}
                    onChange={(e) => setCantidadVidrio(e.target.value)}
                  />
                </label>
                <span>De cada paño</span>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">SERVICIO:</div>
            <div className="panel-body">
              <label>
                <select value={servicio} onChange={(e) => setServicio(e.target.value)}>
                  <option value="">Seleccione...</option>
                  {servicios.map((serv) => (
                    <option key={serv.id} value={serv.id}>
                      {serv.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </div>

        <div className="form-column">
          <section className="panel">
            <div className="panel-title">HERRAJE:</div>
            <div className="panel-body">
              <label>
                COLOR:
                <select value={colorHerraje} onChange={(e) => setColorHerraje(e.target.value)}>
                  <option value="">Seleccione...</option>
                  {herrajes.map((herraje) => (
                    <option key={herraje.id} value={herraje.id}>
                      {herraje.color}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="panel accessories-panel">
            <div className="panel-title">ACCESORIOS:</div>
            <div className="panel-body">
              <div className="table-header">
                <span>CANT.</span>
                <span>DESCRIPCION</span>
              </div>

              {accesorios.map((acc, idx) => (
                <div key={idx} className="table-row">
                  <input
                    className="cell-cant"
                    type="number"
                    value={acc.cantidad || ''}
                    onChange={(e) => handleAccessoryChange(idx, 'cantidad', e.target.value)}
                  />
                  <select
                    className="cell-desc select-desc"
                    value={acc.descripcion}
                    onChange={(e) => handleAccessoryChange(idx, 'descripcion', e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    {accesoriosOptions.map((accOption) => (
                      <option key={accOption.id} value={accOption.descripcion}>
                        {accOption.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">NOTA:</div>
            <div className="panel-body">
              <textarea
                value={notaGeneral}
                onChange={(e) => setNotaGeneral(e.target.value)}
                placeholder="Nota general..."
              />
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              GUARDAR
            </button>
          </div>
        </div>
      </form>

      {status && <p className="status" style={{ color: status.includes('Error') ? 'red' : 'green' }}>{status}</p>}
    </div>
  );
}
