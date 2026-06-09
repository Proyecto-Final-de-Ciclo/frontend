import { useNavigate, useLocation } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";
import { useState, useEffect } from "react";
import { User, Tag, Star, Menu, X, Moon, Sun } from "lucide-react";
import logo from "../assets/logo.png";
import logoDark from "../assets/logooscuro.png";

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, logout } = useUsuario();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [menuMovil, setMenuMovil] = useState(false);

    // cierra el menú de usuario al hacer click fuera
    useEffect(() => {
        const cerrar = (e) => {
            if (!e.target.closest(".menu-usuario")) setMenuAbierto(false);
        };
        document.addEventListener("mousedown", cerrar);
        return () => document.removeEventListener("mousedown", cerrar);
    }, []);

    // cierra el menú móvil al cambiar de ruta
    useEffect(() => {
        setMenuMovil(false);
        setMenuAbierto(false);
    }, [location.pathname]);

    // pestaña activa en escritorio
    const activa = (ruta) =>
        location.pathname === ruta
            ? "bg-naranja-500 text-white text-sm font-medium px-4 py-2 rounded-t-lg"
            : "text-gray-500 hover:text-naranja-600 text-sm font-medium px-4 py-2 rounded-t-lg transition-colors";

    // enlace activo en el panel móvil
    const activaMovil = (ruta) =>
        location.pathname === ruta
            ? "block w-full text-left px-4 py-3 text-sm font-medium text-naranja-600 bg-naranja-50 border-l-4 border-naranja-500"
            : "block w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors";

    const enlaces = [
        { ruta: "/", texto: "Anuncios" },
        { ruta: "/noticias", texto: "Noticias" },
        { ruta: "/comunidad", texto: "Comunidad" },
    ];
    const enlacesAdmin = [
        { ruta: "/usuarios", texto: "Usuarios" },
        { ruta: "/categorias/gestion", texto: "Categorías" },
    ];

    const [tema, setTema] = useState(() => {
        return localStorage.getItem("tema") || "claro";
    });


    // cambiar tema (claro/osucro)
    useEffect(() => {
        if (tema === "oscuro") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("tema", tema);
    }, [tema]);

    const toggleTema = () => setTema(prev => prev === "claro" ? "oscuro" : "claro");

    return (
        <div className="border-b border-gray-100 relative z-50 bg-white">
            <div className="max-w-5xl mx-auto px-4">

                {/* ordenador */}
                <div className="hidden lg:flex items-center justify-between pt-2">

                    {/* logo */}
                    <div className="flex-1">
                        <button
                            onClick={() => navigate("/")}
                            aria-label="Ir a la página principal"
                            className="shrink-0 focus:outline-none"
                        >
                            <img src={tema === "oscuro" ? logoDark : logo} alt="RadiOferta"
                                className="h-9 w-auto hover:opacity-80 transition-opacity" />
                        </button>
                    </div>

                    {/* pestañas */}
                    <div className="flex gap-1 items-end">
                        {enlaces.map(e => (
                            <button key={e.ruta} onClick={() => navigate(e.ruta)} className={activa(e.ruta)}>
                                {e.texto}
                            </button>
                        ))}

                        {/* ?. --> si el usuario es null no peta, devuelve undefined */}
                        {usuario?.rol === "ROLE_ADMIN" && enlacesAdmin.map(e => (
                            <button key={e.ruta} onClick={() => navigate(e.ruta)} className={activa(e.ruta)}>
                                {e.texto}
                            </button>
                        ))}
                    </div>

                    {/* usuario */}
                    <div className="flex-1 flex items-center justify-end gap-2 pb-2">

                        {/* cambiar tema */}
                        <button
                            onClick={toggleTema}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Cambiar tema"
                        >
                            {tema === "claro" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>

                        {/* menú usuario */}
                        {usuario ? (
                            <div className="relative menu-usuario">
                                <button
                                    onClick={() => setMenuAbierto(prev => !prev)}
                                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-naranja-500 hover:border-naranja-600 transition-colors"
                                >
                                    <img src="https://www.gravatar.com/avatar/?d=mp" alt="avatar"
                                        className="w-full h-full object-cover rounded-full" />
                                </button>

                                {menuAbierto && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">{usuario.nombre}</p>
                                            <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
                                        </div>
                                        {usuario.rol !== "ROLE_ADMIN" && (
                                            <button
                                                onClick={() => { setMenuAbierto(false); navigate("/perfil"); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                            >
                                                <User className="w-4 h-4 text-naranja-500" />Mi perfil
                                            </button>
                                        )}
                                        {usuario.rol !== "ROLE_ADMIN" && (
                                            <button
                                                onClick={() => { setMenuAbierto(false); navigate("/mis-anuncios"); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                            >
                                                <Tag className="w-4 h-4 text-naranja-500" />Mis anuncios
                                            </button>
                                        )}
                                        {usuario.rol !== "ROLE_ADMIN" && (
                                            <button
                                                onClick={() => { setMenuAbierto(false); navigate("/favoritos"); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                            >
                                                <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />Mis favoritos
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
                                <button onClick={() => navigate("/registro")}
                                    className="border border-naranja-500 text-naranja-500 hover:bg-naranja-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap">
                                    Registrarse
                                </button>
                                <button onClick={() => navigate("/login")}
                                    className="bg-naranja-500 hover:bg-naranja-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap">
                                    Iniciar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* móvil y tablet */}
                {/* móvil y tablet */}
                <div className="flex lg:hidden items-center justify-between py-2">
                    <button
                        onClick={() => navigate("/")}
                        aria-label="Ir a la página principal"
                        className="shrink-0 focus:outline-none"
                    >
                        <img src={tema === "oscuro" ? logoDark : logo} alt="RadiOferta"
                            className="h-11 w-auto hover:opacity-80 transition-opacity" />
                    </button>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={toggleTema}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Cambiar tema"
                        >
                            {tema === "claro" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setMenuMovil(prev => !prev)}
                            aria-label={menuMovil ? "Cerrar menú" : "Abrir menú"}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            {menuMovil ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/*  menú móvil */}
            {menuMovil && (
                <>
                    {/* fondo oscuro que al tocar cierra el menu */}
                    <div
                        className="lg:hidden absolute top-full left-0 right-0 h-screen bg-black/30 z-40"
                        onClick={() => setMenuMovil(false)}
                    />

                    {/* panel blanco */}
                    <div className="lg:hidden absolute left-0 right-0 top-full bg-white shadow-xl z-50 border-t border-gray-100 max-h-[80vh] overflow-y-auto">

                        {/* enlaces */}
                        <nav className="py-2">
                            {enlaces.map(e => (
                                <button key={e.ruta} onClick={() => navigate(e.ruta)} className={activaMovil(e.ruta)}>
                                    {e.texto}
                                </button>
                            ))}
                            {usuario?.rol === "ROLE_ADMIN" && enlacesAdmin.map(e => (
                                <button key={e.ruta} onClick={() => navigate(e.ruta)} className={activaMovil(e.ruta)}>
                                    {e.texto}
                                </button>
                            ))}
                        </nav>

                        <div className="border-t border-gray-100 my-1" />

                        {/* usuario */}
                        {usuario ? (
                            <div className="px-4 py-2 space-y-1">
                                <div className="flex items-center gap-3 py-2">
                                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-naranja-500 shrink-0">
                                        <img src="https://www.gravatar.com/avatar/?d=mp" alt="avatar"
                                            className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{usuario.nombre}</p>
                                        <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
                                    </div>
                                </div>

                                {usuario.rol !== "ROLE_ADMIN" && (
                                    <button
                                        onClick={() => { setMenuAbierto(false); navigate("/perfil"); }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        <User className="w-4 h-4 text-naranja-500" />Mi perfil
                                    </button>
                                )}
                                {usuario.rol !== "ROLE_ADMIN" && (
                                    <button onClick={() => navigate("/mis-anuncios")}
                                        className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-naranja-500" />Mis anuncios
                                    </button>
                                )}
                                {usuario.rol !== "ROLE_ADMIN" && (
                                    <button onClick={() => navigate("/favoritos")}
                                        className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
                                        <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />Mis favoritos
                                    </button>
                                )}
                                <button onClick={() => { logout(); navigate("/"); }}
                                    className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <div className="px-4 py-3 flex flex-col gap-2">
                                <button onClick={() => navigate("/registro")}
                                    className="w-full border border-naranja-500 text-naranja-500 hover:bg-naranja-50 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
                                    Registrarse
                                </button>
                                <button onClick={() => navigate("/login")}
                                    className="w-full bg-naranja-500 hover:bg-naranja-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
                                    Iniciar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
