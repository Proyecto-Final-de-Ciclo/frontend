import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNoticias } from "../services/noticiaService";
import { useUsuario } from "../context/UsuarioContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer"

export default function Noticias() {
    const navigate = useNavigate();

    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [noticiaActiva, setNoticiaActiva] = useState(null);
    const { usuario } = useUsuario();

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await getNoticias();
                setNoticias(data);
            } catch {
                setError("No se pudieron cargar las noticias.");
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    const abrirNoticia = (noticia) => {
        setNoticiaActiva(noticia);
    };

    const cerrarNoticia = () => {
        setNoticiaActiva(null);
    };

    if (cargando) return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <NavBar />
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <h1 className="text-xl font-bold text-naranja-600">Noticias</h1>
                </div>
            </header>
            <div className="flex items-center justify-center py-32 text-gray-400 text-sm flex-1">
                Cargando noticias...
            </div>
            <Footer />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <NavBar />
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <h1 className="text-xl font-bold text-naranja-600">Noticias</h1>
                </div>
            </header>
            <div className="flex items-center justify-center py-32 text-red-400 text-sm flex-1">
                {error}
            </div>
            <Footer />
        </div>
    );
    
    const destacada = noticias[0];
    const resto = noticias.slice(1);

    return (
        <div className={`${noticiaActiva ? "h-screen overflow-hidden" : "min-h-screen"} bg-transparent flex flex-col`}>

            {/* cabecera */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <NavBar />
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
                    <h1 className="text-xl font-bold text-naranja-600">Noticias</h1>
                    <span className="text-xs text-gray-400 uppercase tracking-widest ml-2 hidden sm:inline">Radioafición · Actualidad</span>
                </div>
            </header>

            {/* contenido principal con panel lateral */}
            {/* CAMBIO 1: Se fuerza a que en pantallas grandes (lg) el main mida exactamente el alto de la pantalla menos la cabecera */}
            <main className={`max-w-5xl mx-auto px-4 py-6 flex-1 w-full ${noticiaActiva ? "min-h-0" : ""}`}>
                <div className={`flex flex-col lg:flex-row gap-6 ${noticiaActiva ? "h-full" : ""}`}>

                    {/* panel izquierdo (Lista de noticias) */}
                    {/* CAMBIO 2: Añadida la clase lg:max-h-full para limitar el alto al contenedor padre cuando hay noticia activa */}
                    <div className={`flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all
                        ${noticiaActiva ? "hidden lg:flex lg:w-2/5 overflow-y-auto" : "w-full"}`}>

                        {/* noticia destacada */}
                        {destacada && (
                            <div
                                onClick={() => abrirNoticia(destacada)}
                                className={`p-5 border-b border-gray-100 cursor-pointer transition-colors ${noticiaActiva?.enlace === destacada.enlace ? "bg-naranja-50 border-l-4 border-l-naranja-500" : "hover:bg-naranja-50"}`}
                            >
                                <p className="text-xs font-medium text-naranja-500 uppercase tracking-widest mb-2">{destacada.fuente} · Destacada</p>
                                <h2 className="text-lg font-semibold text-gray-800 leading-snug mb-2">{destacada.titulo}</h2>
                                <p className={`text-sm text-gray-500 leading-relaxed ${noticiaActiva ? "line-clamp-2" : "line-clamp-3"}`}>{destacada.descripcion}</p>
                                <p className="text-xs text-gray-400 mt-3">{destacada.fecha}</p>
                            </div>
                        )}

                        {/* separador */}
                        <div className="flex items-center gap-3 px-5 py-2 bg-gray-50 sticky top-0 z-10">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Más noticias</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* resto de noticias */}
                        {resto.map((noticia, i) => (
                            <div
                                key={i}
                                onClick={() => abrirNoticia(noticia)}
                                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${noticiaActiva?.enlace === noticia.enlace ? "bg-naranja-50 border-l-4 border-l-naranja-500" : "hover:bg-naranja-50"}`}
                            >
                                <p className="text-xs font-medium text-naranja-500 uppercase tracking-widest mb-1">{noticia.fuente}</p>
                                <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1">{noticia.titulo}</h3>
                                {!noticiaActiva && <p className="text-xs text-gray-500 line-clamp-2">{noticia.descripcion}</p>}
                                <p className="text-xs text-gray-400 mt-2">{noticia.fecha}</p>
                            </div>
                        ))}
                    </div>

                    {/* panel derecho, detalle de la noticia */}
                    {noticiaActiva && (
                        <div className="w-full lg:w-3/5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:h-full lg:max-h-full">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                                <p className="text-xs font-medium text-naranja-500 uppercase tracking-widest">{noticiaActiva.fuente}</p>
                                <div className="flex items-center gap-2">
                                    {/* botón volver en movil */}
                                    <button
                                        onClick={cerrarNoticia}
                                        className="lg:hidden text-xs text-naranja-600 border border-naranja-200 hover:bg-naranja-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        ← Volver
                                    </button>
                                    {/* botón cerrar en ordenador */}
                                    <button
                                        onClick={cerrarNoticia}
                                        className="hidden lg:block text-xs text-gray-400 hover:text-red-400 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        ✕ Cerrar
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                <h2 className="text-xl font-semibold text-gray-800 leading-snug mb-4">{noticiaActiva.titulo}</h2>
                                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                                    {noticiaActiva.descripcion}
                                </p>
                                <p className="text-xs text-gray-400 mb-6 flex items-center gap-2">📅 {noticiaActiva.fecha}</p>
                                <a
                                    href={noticiaActiva.enlace}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-naranja-600 border border-naranja-200 bg-naranja-50 hover:bg-naranja-100 px-4 py-2 rounded-xl transition-colors"
                                >
                                    Leer artículo completo
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}