const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getRecords() {
  const res = await fetch(`${API_URL}/records`);
  if (!res.ok) throw new Error('Error al obtener registros');
  return res.json();
}

export async function createRecord(data: any) {
  const res = await fetch(`${API_URL}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear registro');
  return res.json();
}
