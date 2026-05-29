import { createContext, useContext, useState, useEffect } from "react";
import { getCambio } from "../services/cambioService";

const MonedaContext = createContext(null);

export const MONEDAS = [
    { codigo: "EUR", simbolo: "€" },
    { codigo: "USD", simbolo: "$" },
    { codigo: "GBP", simbolo: "£" },
    { codigo: "JPY", simbolo: "¥" },
    { codigo: "CHF", simbolo: "Fr" },
];

const leerCookieMoneda = () => {
    const match = document.cookie.match(/(?:^|; )moneda=([^;]*)/);
    return match ? match[1] : "EUR";
};

const guardarCookieMoneda = (moneda) => {
    document.cookie = `moneda=${moneda}; max-age=${60 * 60 * 24 * 30}; path=/`;
};

export function MonedaProvider({ children }) {
    const [moneda, setMoneda] = useState(leerCookieMoneda);
    const [tasa, setTasa] = useState(1);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (moneda === "EUR") {
            setTasa(1);
            return;
        }
        const cargar = async () => {
            setCargando(true);
            try {
                const data = await getCambio("EUR", moneda);
                setTasa(data.rates[moneda]);
            } catch {
                setTasa(1);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [moneda]);

    const cambiarMoneda = (nueva) => {
        guardarCookieMoneda(nueva);
        setMoneda(nueva);
    };

    const convertir = (precio) => {
        return (precio * tasa).toFixed(2);
    };

    return (
        <MonedaContext.Provider value={{ moneda, tasa, cargando, cambiarMoneda, convertir }}>
            {children}
        </MonedaContext.Provider>
    );
}

export function useMoneda() {
    return useContext(MonedaContext);
}