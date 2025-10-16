import { useState } from 'react';
import { createRecord } from '../../api/index';
import './FormPage.css';

export default function FormPage() {
  type Accessory = { cantidad: string; descripcion: string };

  const [cliente, setCliente] = useState('');
  const [referencia, setReferencia] = useState('');
  const [obra, setObra] = useState('');

  const [tipoComprobante, setTipoComprobante] = useState('');
  const [numeroComprobante, setNumeroComprobante] = useState('');

  const [tipoVidrio, setTipoVidrio] = useState('');
  const [colorVidrio, setColorVidrio] = useState('');
  const [cantidadVidrio, setCantidadVidrio] = useState('');

  const [servicio, setServicio] = useState('');

  const [colorHerraje, setColorHerraje] = useState('');

  const [accesorios, setAccesorios] = useState<Accessory[]>([
    { cantidad: '', descripcion: '' },
    { cantidad: '', descripcion: '' },
    { cantidad: '', descripcion: '' },
  ]);
  const [notaAccesorios, setNotaAccesorios] = useState('');

  const [notaGeneral, setNotaGeneral] = useState('');
  const [status, setStatus] = useState('');

  const handleAccessoryChange = (index: number, field: keyof Accessory, value: string) => {
    setAccesorios((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      datosCliente: { cliente, referencia, obra },
      comprobante: { tipo: tipoComprobante, numero: numeroComprobante },
      vidrio: { tipo: tipoVidrio, color: colorVidrio, cantidad: cantidadVidrio },
      servicio,
      herraje: { color: colorHerraje },
      accesorios,
      notaAccesorios,
      notaGeneral,
    };

    try {
      await createRecord(formData);
      setStatus('Registro creado con éxito');
    } catch (err) {
      setStatus('Error al crear registro');
      console.error(err);
    }
  };

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
                <select value={tipoComprobante} onChange={(e) => setTipoComprobante(e.target.value)}></select>
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
                <select value={tipoVidrio} onChange={(e) => setTipoVidrio(e.target.value)}></select>
              </label>
              <label>
                COLOR:
                <select value={colorVidrio} onChange={(e) => setColorVidrio(e.target.value)}></select>
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
                <select value={servicio} onChange={(e) => setServicio(e.target.value)}></select>
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
                <select value={colorHerraje} onChange={(e) => setColorHerraje(e.target.value)}></select>
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
                    value={acc.cantidad}
                    onChange={(e) => handleAccessoryChange(idx, 'cantidad', e.target.value)}
                  />
                  <select
                    className="cell-desc select-desc"
                    value={acc.descripcion}
                    onChange={(e) => handleAccessoryChange(idx, 'descripcion', e.target.value)}
                  >
                    {/* opciones se poblarán desde la BD */}
                  </select>
                </div>
              ))}

              <div className="panel-note">
                <textarea
                  value={notaAccesorios}
                  onChange={(e) => setNotaAccesorios(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">NOTA:</div>
            <div className="panel-body">
              <textarea value={notaGeneral} onChange={(e) => setNotaGeneral(e.target.value)} />
            </div>
          </section>
        </div>
      </form>

      {status && <p className="status">{status}</p>}
    </div>
  );
}
