const BASE = import.meta.env.VITE_APP_BACKEND;
import { getToken } from "./usuarioService";

const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

export const getLlamadas = async () => {
  const response = await fetch(`${BASE}/llamadas`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Error al obtener las llamadas activas");

  return await response.json();
};

export const publicarLlamada = async (llamada, minutos) => {
  const response = await fetch(`${BASE}/llamada?minutos=${minutos}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(llamada),
  });

  if (response.status === 403) {
    const mensaje = await response.text();
    throw new Error(mensaje);
  }

  if (!response.ok) throw new Error("Error al publicar la llamada");
  return await response.json();
};

export const deleteLlamada = async (id) => {
  const response = await fetch(`${BASE}/llamada/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`Error al borrar la llamada ${id}`);

  return true;
};