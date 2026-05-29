// Base URL del backend, definida en el archivo .env como VITE_APP_BACKEND
const BASE = import.meta.env.VITE_APP_BACKEND;
import { getToken } from "./usuarioService";

// añade el token JWT a las peticiones protegidas
const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

// ─── GET /anuncios ────────────────────────────────────────────────
// Obtiene todos los anuncios disponibles
export const getAnuncios = async (filtros = {}, page = 0) => {
  const params = new URLSearchParams();
  if (filtros.nombre) params.append("nombre", filtros.nombre);
  if (filtros.categoria) params.append("categoria", filtros.categoria);
  if (filtros.estado) params.append("estado", filtros.estado);
  if (filtros.precioMin) params.append("precioMin", filtros.precioMin);
  if (filtros.precioMax) params.append("precioMax", filtros.precioMax);
  params.append("page", page);

  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE}/anuncios?${params.toString()}`, { headers });

  if (response.status === 404) return { content: [], totalPages: 0, totalElements: 0 };
  if (!response.ok) throw new Error("Error al obtener los anuncios");
  return await response.json();
};

// ─── GET /anuncio/:id ─────────────────────────────────────────────
// Obtiene un único anuncio por su ID
export const getAnuncio = async (id) => {
  const response = await fetch(`${BASE}/anuncio/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Error al obtener el anuncio ${id}`);

  return await response.json();
};

// ─── GET /anuncio/:id/imagenes ────────────────────────────────────
// Obtiene las imágenes de un anuncio
export const getImagenesAnuncio = async (id) => {
  const response = await fetch(`${BASE}/anuncio/${id}/imagenes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`Error al obtener las imágenes del anuncio ${id}`);

  return await response.json();
};

// ─── POST /anuncio ────────────────────────────────────────────────
// Crea un nuevo anuncio. `anuncio` es un objeto con los campos del modelo
export const createAnuncio = async (anuncio, files, imagenPrincipal) => {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(anuncio)], { type: "application/json" }));
  files.forEach(file => formData.append("files", file));
  formData.append("principal", String(imagenPrincipal)); // ← nuevo

  const response = await fetch(`${BASE}/anuncio`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  });

  if (!response.ok) throw new Error("Error al crear el anuncio");
  return await response.json();
};

// ─── PUT /anuncio/:id ─────────────────────────────────────────────
// Edita un anuncio existente. Enviamos el objeto completo actualizado
export const updateAnuncio = async (id, anuncio) => {
  const response = await fetch(`${BASE}/anuncio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(anuncio),
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Error al editar el anuncio ${id}`);

  return await response.json();
};

// ─── DELETE /anuncio/:id ──────────────────────────────────────────
// Elimina un anuncio por su ID. El backend devuelve 204 (sin contenido)
export const deleteAnuncio = async (id) => {
  const response = await fetch(`${BASE}/anuncio/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (response.status === 404) return false;
  if (!response.ok) throw new Error(`Error al borrar el anuncio ${id}`);

  // 204 No Content → éxito, devolvemos true para confirmarlo
  return true;
};

// ─── DELETE /anuncio/:id/imagenes/:imagenId ───────────────────────
export const deleteImagenAnuncio = async (anuncioId, imagenId) => {
  const response = await fetch(`${BASE}/anuncio/${anuncioId}/imagenes/${imagenId}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!response.ok) throw new Error("Error al borrar la imagen");
  return true;
};

// ─── PUT /anuncio/:id/imagenes ────────────────────────────────────
export const addImagenesAnuncio = async (anuncioId, files, indicePrincipal = -1) => {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  formData.append("principal", String(indicePrincipal));

  const response = await fetch(`${BASE}/anuncio/${anuncioId}/imagenes`, {
    method: "PUT",
    headers: authHeader(),
    body: formData,
  });
  if (!response.ok) throw new Error("Error al añadir las imágenes");
  return await response.json();
};

// ─── PUT /anuncio/:id/imagenes/:imagenId/principal ────────────────
export const setPrincipalAnuncio = async (anuncioId, imagenId) => {
  const response = await fetch(`${BASE}/anuncio/${anuncioId}/imagenes/${imagenId}/principal`, {
    method: "PUT",
    headers: authHeader(),
  });
  if (!response.ok) throw new Error("Error al cambiar la imagen principal");
  return await response.json();
};

// ─── GET /anuncios/mios ───────────────────────────────────────────
// Obtiene los anuncios del usuario conectado
export const getMisAnuncios = async () => {
  const response = await fetch(`${BASE}/anuncios/mios`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...authHeader() },
  });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Error al obtener mis anuncios");
  return await response.json();
};