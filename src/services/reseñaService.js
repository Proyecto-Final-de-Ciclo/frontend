import { getToken } from "./usuarioService";

const BASE = import.meta.env.VITE_APP_BACKEND;

export const getReseñas = async (vendedorId) => {
    const response = await fetch(`${BASE}/usuario/${vendedorId}/reseñas`);
    if (!response.ok) throw new Error("Error al obtener las reseñas");
    return await response.json();
};

export const crearReseña = async (vendedorId, puntuacion, comentario) => {
    const response = await fetch(`${BASE}/usuario/${vendedorId}/reseña`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ puntuacion, comentario })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear la reseña");
    }
    return await response.json();
};

export const borrarReseña = async (reseñaId) => {
    const response = await fetch(`${BASE}/reseña/${reseñaId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error("Error al borrar la reseña");
    return true;
};
