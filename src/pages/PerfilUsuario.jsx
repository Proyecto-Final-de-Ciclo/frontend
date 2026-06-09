import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsuarioPublico, getAnunciosUsuario } from "../services/usuarioService";
import { useUsuario } from "../context/UsuarioContext";
import { deleteAnuncio } from "../services/anuncioServices";
import AnuncioCard from "../components/AnuncioCard";
import { User, Calendar, Tag, Star, Radio, Signal, Mail } from "lucide-react";
import { getReseñas, crearReseña, borrarReseña } from "../services/reseñaService";
import BotonVolver from "../components/BotonVolver";
import Footer from "../components/Footer"

// muestra estrellas
function Estrellas({ puntuacion, tamaño = "w-4 h-4" }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={tamaño}
                    fill={i <= puntuacion ? "#FBBF24" : "none"}
                    stroke={i <= puntuacion ? "#FBBF24" : "#D1D5DB"}
                />
            ))}
        </div>
    );
}

// selecciina estrellas
function SelectorEstrellas({ valor, onChange }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className="w-7 h-7 cursor-pointer transition-transform hover:scale-110"
                    fill={i <= (hover || valor) ? "#FBBF24" : "none"}
                    stroke={i <= (hover || valor) ? "#FBBF24" : "#D1D5DB"}
                    onClick={() => onChange(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                />
            ))}
        </div>
    );
}

export default function PerfilUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuario } = useUsuario();

    const [perfil, setPerfil] = useState(null);
    const [anuncios, setAnuncios] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);

    const [reseñas, setReseñas] = useState([]);
    const [puntuacion, setPuntuacion] = useState(0);
    const [comentario, setComentario] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [errorReseña, setErrorReseña] = useState(null);

    const [panelAbierto, setPanelAbierto] = useState(false);

    const esPropietario = usuario && usuario.id === Number(id);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [datosPerfil, datosAnuncios, datosReseñas] = await Promise.all([
                    getUsuarioPublico(id),
                    getAnunciosUsuario(id),
                    getReseñas(id)
                ]);
                setPerfil(datosPerfil);
                setAnuncios(datosAnuncios);
                setReseñas(datosReseñas);
            } catch {
                setError("No se pudo cargar el perfil.");
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [id]);

    const handleDelete = async (anuncioId) => {
        if (window.confirm("¿Seguro que quieres borrar este anuncio?")) {
            try {
                await deleteAnuncio(anuncioId);
                setAnuncios(prev => prev.filter(a => a.id !== anuncioId));
            } catch {
                alert("Error al borrar el anuncio");
            }
        }
    };

    const handleBorrarReseña = async (reseñaId) => {
        if (window.confirm("¿Seguro que quieres borrar esta reseña?")) {
            try {
                await borrarReseña(reseñaId);
                const reseñasActualizadas = await getReseñas(id);
                setReseñas(reseñasActualizadas);
                const perfilActualizado = await getUsuarioPublico(id);
                setPerfil(perfilActualizado);
            } catch {
                alert("Error al borrar la reseña");
            }
        }
    };

    const puedeReseñar = usuario && usuario.id !== Number(id) && usuario.rol !== "ROLE_ADMIN";

    if (cargando) return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-gray-400">
            Cargando...
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-red-400 gap-4">
            <p>{error}</p>
            <button onClick={() => navigate("/")} className="text-naranja-600 underline text-sm">
                Volver a los anuncios
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent flex flex-col">

            {/* cabecera */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
                    <BotonVolver />
                    <h1 className="text-xl font-bold text-naranja-600">Perfil del vendedor</h1>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 flex-1 w-full">

                {/* perfil */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">

                    {/* avatar con inicial del nombre */}
                    <div className="w-16 h-16 rounded-full bg-naranja-100 flex items-center justify-center shrink-0">
                        <span className="text-2xl font-bold text-naranja-600">
                            {perfil.nombre.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {/* datos usuario */}
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-naranja-500" />
                            {perfil.nombre}
                        </h2>
                        {(perfil.nombreReal || perfil.apellidos) && (
                            <p className="text-sm text-gray-500">
                                {[perfil.nombreReal, perfil.apellidos].filter(Boolean).join(" ")}
                            </p>
                        )}
                        {perfil.fechaRegistro && (
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Miembro desde {perfil.fechaRegistro}
                            </p>
                        )}
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            {anuncios.length} anuncio{anuncios.length !== 1 ? "s" : ""} publicado{anuncios.length !== 1 ? "s" : ""}
                        </p>
                        {perfil.mediaEstrellas != null ? (
                            <div className="flex items-center gap-2 mt-1">
                                <Estrellas puntuacion={Math.round(perfil.mediaEstrellas)} />
                                <span className="text-sm text-gray-500">
                                    {perfil.mediaEstrellas.toFixed(1)} · {perfil.totalReseñas} reseña{perfil.totalReseñas !== 1 ? "s" : ""}
                                </span>
                            </div>

                        ) : (
                            <p className="text-sm text-gray-400 mt-1">Sin reseñas aún</p>
                        )}
                        {/* campos nuevos del perfil */}
                        {perfil.indicativo && (
                            <p className="text-sm text-gray-500">📡 {perfil.indicativo}</p>
                        )}
                        {perfil.localizacion && (
                            <p className="text-sm text-gray-500">📍 {perfil.localizacion}</p>
                        )}
                        {perfil.email && (
                            <p className="text-sm text-gray-500">✉️ {perfil.email}</p>
                        )}
                        {perfil.descripcion && (
                            <p className="text-sm text-gray-600 mt-2 italic break-words">{perfil.descripcion}</p>
                        )}

                        {/* botón editar, solo visible para el propietario */}
                        {esPropietario && (
                            <button
                                onClick={() => navigate("/perfil")}
                                className="mt-3 bg-naranja-500 hover:bg-naranja-600 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                            >
                                Editar perfil
                            </button>
                        )}
                    </div>
                </div>

                {/* datos de radioaficionado (solo lo público) */}
                {(perfil.modos || perfil.qslBuro || perfil.descripcionRadio ||
                    (perfil.mostrarActivoDesde && perfil.activoDesde)) && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-5 flex items-center gap-2">
                                <Radio className="w-5 h-5 text-naranja-500" />
                                Datos de radioaficionado
                            </h3>

                            {/* tarjetas de datos */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {perfil.mostrarActivoDesde && perfil.activoDesde && (
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                        <div className="w-9 h-9 rounded-lg bg-naranja-100 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-naranja-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Activo desde</p>
                                            <p className="text-sm font-medium text-gray-700">{perfil.activoDesde}</p>
                                        </div>
                                    </div>
                                )}
                                {perfil.modos && (
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                        <div className="w-9 h-9 rounded-lg bg-naranja-100 flex items-center justify-center shrink-0">
                                            <Signal className="w-4 h-4 text-naranja-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Modos</p>
                                            <p className="text-sm font-medium text-gray-700">{perfil.modos}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                    <div className="w-9 h-9 rounded-lg bg-naranja-100 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-naranja-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide">QSL por buró</p>
                                        <p className="text-sm font-medium text-gray-700">{perfil.qslBuro ? "Sí" : "No"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* descripción */}
                            {perfil.descripcionRadio && (
                                <p className="text-sm text-gray-600 italic break-words mt-4 pt-4 border-t border-gray-100">
                                    {perfil.descripcionRadio}
                                </p>
                            )}
                        </div>
                    )}

                {/* anuncios */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Anuncios de {perfil.nombre}
                    </h3>

                    {anuncios.length === 0 ? (
                        <div className="text-center py-32 text-gray-400">
                            <p>Este usuario no tiene anuncios publicados.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {anuncios.map((anuncio) => (
                                <AnuncioCard
                                    key={anuncio.id}
                                    anuncio={anuncio}
                                    imagenes={anuncio.imagenes || []}
                                    onDelete={handleDelete}
                                    usuario={usuario}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Reseñas de {perfil.nombre}
                    </h3>

                    {puedeReseñar && (
                        <div className="mb-6">
                            <button
                                onClick={() => {
                                    setPanelAbierto(prev => !prev);
                                    setPuntuacion(0);
                                    setComentario("");
                                    setErrorReseña(null);
                                }}
                                className={panelAbierto
                                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
                                    : "bg-naranja-500 hover:bg-naranja-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
                                }
                            >
                                {panelAbierto ? "Cancelar" : "Añadir reseña"}
                            </button>

                            {panelAbierto && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-3">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Deja tu valoración</p>
                                    <SelectorEstrellas valor={puntuacion} onChange={setPuntuacion} />
                                    <textarea
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        placeholder="Comentario opcional..."
                                        maxLength={500}
                                        rows={3}
                                        className="w-full mt-3 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-naranja-500 resize-none"
                                    />
                                    {errorReseña && <p className="text-xs text-red-400 mt-1">{errorReseña}</p>}
                                    <button
                                        onClick={async () => {
                                            if (puntuacion === 0) { setErrorReseña("Selecciona una puntuación."); return; }
                                            setEnviando(true);
                                            setErrorReseña(null);
                                            try {
                                                await crearReseña(id, puntuacion, comentario);
                                                const reseñasActualizadas = await getReseñas(id);
                                                setReseñas(reseñasActualizadas);
                                                const perfilActualizado = await getUsuarioPublico(id);
                                                setPerfil(perfilActualizado);
                                                setPanelAbierto(false); // 👈 cierra el panel
                                                setPuntuacion(0);
                                                setComentario("");
                                            } catch (e) {
                                                setErrorReseña(e.message);
                                            } finally {
                                                setEnviando(false);
                                            }
                                        }}
                                        disabled={enviando}
                                        className="mt-3 bg-naranja-500 hover:bg-naranja-600 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
                                    >
                                        {enviando ? "Enviando..." : "Publicar reseña"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {reseñas.length === 0 ? (
                        <div className="text-center py-32 text-gray-400">
                            <p>Este vendedor no tiene reseñas todavía.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {reseñas.map((reseña) => (
                                <div key={reseña.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-naranja-100 flex items-center justify-center shrink-0">
                                                <span className="text-sm font-bold text-naranja-600">
                                                    {reseña.autor.nombre.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{reseña.autor.nombre}</p>
                                                <p className="text-xs text-gray-400">{reseña.fecha}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Estrellas puntuacion={reseña.puntuacion} />
                                            {(usuario?.id === reseña.autor.id || usuario?.rol === "ROLE_ADMIN") && (
                                                <button
                                                    onClick={() => handleBorrarReseña(reseña.id)}
                                                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    Borrar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {reseña.comentario && (
                                        <p className="text-sm text-gray-600 mt-3">{reseña.comentario}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}


                </div>
            </main>
            <Footer />
        </div>
    );
}
