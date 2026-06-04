import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarios, updateUsuario, deleteUsuario } from "../services/usuarioService";
import { useUsuario } from "../context/UsuarioContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer"

export default function ListaUsuarios() {
  const navigate = useNavigate();
  const { usuario } = useUsuario();
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);

  const cargarUsuarios = async (texto = "") => {
    setCargando(true);
    try {
      const data = await getUsuarios(texto);
      setUsuarios(data);
    } catch {
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    cargarUsuarios(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar este usuario?")) {
      try {
        await deleteUsuario(id);
        setUsuarios(prev => prev.filter(u => u.id !== id));
      } catch {
        alert("Error al borrar el usuario");
      }
    }
  };

  const handleEdit = (u) => {
    setEditando({ ...u });
  };

  const handleSaveEdit = async () => {
    try {
      const actualizado = await updateUsuario(editando.id, editando);
      setUsuarios(prev => prev.map(u => u.id === actualizado.id ? actualizado : u));
      setEditando(null);
    } catch {
      alert("Error al editar el usuario");
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">

      {/* cabecera */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <NavBar />

        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">

          {/* buscador */}
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={handleBusqueda}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
          />
        </div>
      </header>

      {/* edición */}
      {editando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Editar usuario</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  value={editando.nombre}
                  onChange={e => setEditando({ ...editando, nombre: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editando.email}
                  onChange={e => setEditando({ ...editando, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={editando.rol}
                  onChange={e => setEditando({ ...editando, rol: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditando(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-oferta-500 hover:bg-oferta-600 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* contenido */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full flex flex-col">

        {cargando && (
          <div className="flex-1 flex items-center justify-center text-gray-400">Cargando...</div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center text-red-400"><p>{error}</p></div>
        )}

        {!cargando && !error && usuarios.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-red-400">
            <p>No se encontraron usuarios.</p>
          </div>
        )}

        {!cargando && !error && usuarios.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}
            </p>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {usuarios.map((u, index) => (
                <div
                  key={u.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 ${index !== usuarios.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{u.nombre}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                      ${u.rol === "ADMIN"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-oferta-50 text-oferta-600"}`}
                    >
                      {u.rol === "ADMIN" ? "Administrador" : "Usuario"}
                    </span>
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-sm bg-red-50 hover:bg-red-100 text-red-500 font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Borrar
                    </button>
                  </div>
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