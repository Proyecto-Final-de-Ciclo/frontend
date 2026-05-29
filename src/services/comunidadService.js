// Ruta: src/services/comunidadService.js

const BASE = import.meta.env.VITE_APP_BACKEND;
import { getToken } from "./usuarioService";

// Añade el token JWT a las peticiones protegidas
// Mismo patrón que anuncioServices.js
const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

// ─── GET /llamadas ────────────────────────────────────────────────
// Obtiene todas las llamadas activas (no expiradas)
// ordenadas de más reciente a más antigua
// Es pública: no necesita token
export const getLlamadas = async () => {
  const response = await fetch(`${BASE}/llamadas`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  // 404 significa que no hay llamadas activas → devolvemos array vacío
  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Error al obtener las llamadas activas");

  return await response.json();
};

// ─── POST /llamada?minutos=30 ─────────────────────────────────────
// Publica una nueva llamada
// `llamada` es un objeto con: frecuencia, banda, modo, mensaje (opcional)
// `minutos` es 30, 120 o 1440 según lo que elija el usuario
export const publicarLlamada = async (llamada, minutos) => {
  const response = await fetch(`${BASE}/llamada?minutos=${minutos}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(llamada),
  });

  // 403 significa que el usuario no tiene indicativo en su perfil
  if (response.status === 403) {
    const mensaje = await response.text();
    throw new Error(mensaje);
  }

  if (!response.ok) throw new Error("Error al publicar la llamada");
  return await response.json();
};

// ─── DELETE /llamada/:id ──────────────────────────────────────────
// Borra una llamada. Solo el dueño o un admin pueden hacerlo
export const deleteLlamada = async (id) => {
  const response = await fetch(`${BASE}/llamada/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`Error al borrar la llamada ${id}`);

  // 204 No Content → éxito
  return true;
};