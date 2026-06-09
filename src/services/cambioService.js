const BASE = import.meta.env.VITE_APP_BACKEND;

export const getCambio = async (from, to) => {
    const response = await fetch(`${BASE}/cambio?from=${from}&to=${to}`);
    if (!response.ok) throw new Error("Error al obtener el tipo de cambio");
    return await response.json();
};