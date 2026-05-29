const BASE = import.meta.env.VITE_APP_BACKEND;
import { getToken } from "./usuarioService";

// añade el token JWT a las peticiones protegidas
const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

// ─── GET /favorito/:anuncioId ─────────────────────────────────────
// Comprueba si un anuncio es favorito del usuario conectado
export const esFavoritoAnuncio = async (anuncioId) => {
  const response = await fetch(`${BASE}/favorito/${anuncioId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...authHeader() },
  });

  if (!response.ok) return false;

  const data = await response.json();
  return data.esFavorito;
};

// ─── GET /favoritos ───────────────────────────────────────────────
// Obtiene todos los favoritos del usuario conectado
export const getMisFavoritos = async () => {
  const response = await fetch(`${BASE}/favoritos`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...authHeader() },
  });

  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Error al obtener los favoritos");

  return await response.json();
};

// ─── POST /favorito/:anuncioId ────────────────────────────────────
// Añade un anuncio a favoritos
export const addFavorito = async (anuncioId) => {
  const response = await fetch(`${BASE}/favorito/${anuncioId}`, {
    method: "POST",
    headers: authHeader(),
  });

  if (!response.ok) throw new Error("Error al añadir el favorito");
  return true;
};

// ─── DELETE /favorito/:anuncioId ──────────────────────────────────
// Quita un anuncio de favoritos
export const removeFavorito = async (anuncioId) => {
  const response = await fetch(`${BASE}/favorito/${anuncioId}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  if (!response.ok) throw new Error("Error al quitar el favorito");
  return true;
};