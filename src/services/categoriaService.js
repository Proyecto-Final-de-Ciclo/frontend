const BASE = import.meta.env.VITE_APP_BACKEND;
import { getToken } from "./usuarioService";

const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

export const getCategorias = async () => {
    const response = await fetch(`${BASE}/categorias`);
    if (!response.ok) throw new Error("Error al obtener las categorías");
    return await response.json();
};

export const crearCategoria = async (nombre) => {
    const response = await fetch(`${BASE}/categoria`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ nombre })
    });
    if (!response.ok) throw new Error("Error al crear la categoría");
    return await response.json();
};

export const editarCategoria = async (id, nombre) => {
    const response = await fetch(`${BASE}/categoria/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ id, nombre })
    });
    if (!response.ok) throw new Error("Error al editar la categoría");
    return await response.json();
};

export const eliminarCategoria = async (id) => {
    const response = await fetch(`${BASE}/categoria/${id}`, {
        method: "DELETE",
        headers: authHeader()
    });
    if (!response.ok) {
        const mensaje = await response.text();
        throw new Error(mensaje || "Error al eliminar la categoría");
    }
    return true;
};