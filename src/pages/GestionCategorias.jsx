import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";
import { getCategorias, crearCategoria, editarCategoria, eliminarCategoria } from "../services/categoriaService";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export default function GestionCategorias() {
    const navigate = useNavigate();
    const { usuario } = useUsuario();
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);

    const [nuevaNombre, setNuevaNombre] = useState("");
    const [creando, setCreando] = useState(false);

    const [editando, setEditando] = useState(null);

    useEffect(() => {
        if (!usuario || usuario.rol !== "ROLE_ADMIN") navigate("/");
    }, [usuario]);

    useEffect(() => {
        cargar();
    }, []);

    const cargar = async () => {
        setCargando(true);
        try {
            const data = await getCategorias();
            setCategorias(data);
        } catch {
            setError("No se pudieron cargar las categorías.");
        } finally {
            setCargando(false);
        }
    };

    const handleCrear = async () => {
        if (!nuevaNombre.trim()) return;
        setCreando(true);
        setError(null);
        try {
            const nueva = await crearCategoria(nuevaNombre.trim());
            setCategorias(prev => [...prev, nueva]);
            setNuevaNombre("");
        } catch (e) {
            setError(e.message);
        } finally {
            setCreando(false);
        }
    };

    const handleEditar = async () => {
        if (!editando.nombre.trim()) return;
        try {
            const actualizada = await editarCategoria(editando.id, editando.nombre.trim());
            setCategorias(prev => prev.map(c => c.id === actualizada.id ? actualizada : c));
            setEditando(null);
        } catch (e) {
            setError(e.message);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;
        try {
            await eliminarCategoria(id);
            setCategorias(prev => prev.filter(c => c.id !== id));
        } catch (e) {
            setError(e.message);
        }
    };

    if (cargando) return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <NavBar />
            </header>
            <div className="flex-1 flex items-center justify-center text-gray-400">
                Cargando...
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <NavBar />
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Nueva categoría..."
                        value={nuevaNombre}
                        onChange={(e) => setNuevaNombre(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCrear()}
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
                    />
                    <button
                        onClick={handleCrear}
                        disabled={creando || !nuevaNombre.trim()}
                        className="bg-oferta-500 hover:bg-oferta-600 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap"
                    >
                        {creando ? "Creando..." : "+ Crear"}
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full flex flex-col">

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 rounded-xl p-3 mb-4">
                        {error}
                    </div>
                )}

                {categorias.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <p>No hay categorías.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-400 mb-4">
                            {categorias.length} categoría{categorias.length !== 1 ? "s" : ""}
                        </p>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {categorias.map((cat, index) => (
                                <div
                                    key={cat.id}
                                    className={`flex items-center gap-3 px-4 sm:px-6 py-4 ${index !== categorias.length - 1 ? "border-b border-gray-100" : ""}`}
                                >
                                    {editando?.id === cat.id ? (
                                        <>
                                            <input
                                                value={editando.nombre}
                                                onChange={(e) => setEditando(prev => ({ ...prev, nombre: e.target.value }))}
                                                onKeyDown={(e) => e.key === "Enter" && handleEditar()}
                                                className="flex-1 border border-gray-200 rounded-xl px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleEditar}
                                                className="text-sm bg-oferta-500 hover:bg-oferta-600 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => setEditando(null)}
                                                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-sm font-semibold text-gray-800">{cat.nombre}</span>
                                            <button
                                                onClick={() => setEditando({ id: cat.id, nombre: cat.nombre })}
                                                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(cat.id)}
                                                className="text-sm bg-red-50 hover:bg-red-100 text-red-500 font-medium px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Borrar
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}