import { useState } from 'react';
import { createRecord } from '../api/index';

export default function FormPage() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createRecord({ nombre, mensaje });
      setStatus('Registro creado con éxito');
      setNombre('');
      setMensaje('');
    } catch (err) {
      setStatus('Error al crear registro');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Formulario</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          placeholder="Mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
