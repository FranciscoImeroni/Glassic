// En producción, el backend y frontend están en el mismo dominio
// En desarrollo, apunta a localhost:3000
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:3000/api');

export { API_URL };