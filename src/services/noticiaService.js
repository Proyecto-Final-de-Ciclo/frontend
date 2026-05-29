const BASE = import.meta.env.VITE_APP_BACKEND;

export const getNoticias = async () => {
    const response = await fetch(`${BASE}/noticias`);
    if (!response.ok) throw new Error("Error al obtener las noticias");
    return await response.json();
};