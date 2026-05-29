import { useNavigate, useLocation } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";
import { useState, useEffect } from "react";
import { User, Tag, Star } from "lucide-react";

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, logout } = useUsuario();
    const [menuAbierto, setMenuAbierto] = useState(false);

    // cierra el menú al hacer click fuera
    useEffect(() => {
        const cerrar = (e) => {
            if (!e.target.closest(".menu-usuario")) setMenuAbierto(false);
        };
        document.addEventListener("mousedown", cerrar);
        return () => document.removeEventListener("mousedown", cerrar);
    }, []);

    const activa = (ruta) =>
        location.pathname === ruta
            ? "bg-oferta-500 text-white text-sm font-medium px-4 py-2 rounded-t-lg"
            : "text-gray-500 hover:text-oferta-600 text-sm font-medium px-4 py-2 rounded-t-lg transition-colors";

    return (
        <div className="border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between pt-2">

                {/* pestañas izquierda */}
                <div className="flex gap-1">
                    <button onClick={() => navigate("/")} className={activa("/")}>
                        Anuncios
                    </button>
                    <button onClick={() => navigate("/noticias")} className={activa("/noticias")}>
                        Noticias
                    </button>
                    <button onClick={() => navigate("/comunidad")} className={activa("/comunidad")}>
                        Comunidad
                    </button>
                    {usuario?.rol === "ROLE_ADMIN" && (
                        <button onClick={() => navigate("/usuarios")} className={activa("/usuarios")}>
                            Usuarios
                        </button>
                    )}
                    {usuario?.rol === "ROLE_ADMIN" && (
                        <button onClick={() => navigate("/categorias/gestion")} className={activa("/categorias/gestion")}>
                            Categorías
                        </button>
                    )}
                </div>

                {/* zona derecha — usuario */}
                <div className="flex items-center gap-2 pb-2">
                    {usuario ? (
                        <div className="relative menu-usuario">
                            <button
                                onClick={() => setMenuAbierto(prev => !prev)}
                                className="w-9 h-9 rounded-full overflow-hidden border-2 border-oferta-500 hover:border-oferta-600 transition-colors"
                            >
                                <img
                                    src="https://www.gravatar.com/avatar/?d=mp"
                                    alt="avatar"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </button>

                            {menuAbierto && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">{usuario.nombre}</p>
                                        <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
                                    </div>
                                    <button
                                        onClick={() => { setMenuAbierto(false); navigate("/perfil"); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4 text-oferta-500" />
                                        Mi perfil
                                    </button>
                                    {usuario.rol !== "ROLE_ADMIN" && (
                                        <button
                                            onClick={() => { setMenuAbierto(false); navigate("/mis-anuncios"); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <Tag className="w-4 h-4 text-oferta-500" />
                                            Mis anuncios
                                        </button>
                                    )}
                                    {usuario.rol !== "ROLE_ADMIN" && (
                                        <button
                                            onClick={() => { setMenuAbierto(false); navigate("/favoritos"); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                                            Mis favoritos
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setMenuAbierto(false); logout(); navigate("/"); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition-colors"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/registro")}
                                className="border border-oferta-500 text-oferta-500 hover:bg-oferta-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap"
                            >
                                Registrarse
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-oferta-500 hover:bg-oferta-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}