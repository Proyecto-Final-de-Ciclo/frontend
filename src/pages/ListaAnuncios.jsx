import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnuncioCard from "../components/AnuncioCard";
import { getAnuncios, deleteAnuncio } from "../services/anuncioServices";
import { useUsuario } from "../context/UsuarioContext";
import { getUsuarios } from "../services/usuarioService";
import { useMoneda, MONEDAS } from "../context/MonedaContext";
import { getCategorias } from "../services/categoriaService";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ListaAnuncios() {

  const navigate = useNavigate();

  const { usuario } = useUsuario();
  const [anuncios, setAnuncios] = useState([]);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalAnuncios, setTotalAnuncios] = useState(0);
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [resultadosUsuarios, setResultadosUsuarios] = useState([]);
  const [buscandoUsuarios, setBuscandoUsuarios] = useState(false);
  const { moneda, cambiarMoneda } = useMoneda();
  const [categorias, setCategorias] = useState([]);

  // filtros
  const [filtros, setFiltros] = useState({
    nombre: "", categoria: "", estado: "", precioMin: "", precioMax: "", orden: ""
  });

  // obtiene los anuncios
  const cargarAnuncios = async (filtrosActivos = {}, pagina = 0) => {
    setError(null);
    try {
      const data = await getAnuncios(filtrosActivos, pagina);
      const ordenados = ordenarAnuncios(data.content, filtrosActivos.orden);
      setAnuncios(ordenados);
      setTotalPaginas(data.totalPages);
      setTotalAnuncios(data.totalElements);
      setPaginaActual(data.number);
    } catch {
      setError("No se pudieron cargar los anuncios.");
    }
  };

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => { });
    cargarAnuncios(filtros);
  }, []);

  // borra un anuncio de la base de datos y de la lista
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar este anuncio?")) {
      try {
        await deleteAnuncio(id);
        // devuelve un nuevo array sin el anuncio que se ha borrado
        setAnuncios((lista) => lista.filter((a) => a.id !== id));
      } catch {
        alert("Error al borrar el anuncio");
      }
    }
  };

  const limpiarFiltros = () => {
    const vacio = { nombre: "", categoria: "", estado: "", precioMin: "", precioMax: "", orden: "" };
    setFiltros(vacio);
    cargarAnuncios({}, 0);
  };

  const cambiarFiltro = (nombre, valor) => {
    const nuevosFiltros = { ...filtros, [nombre]: valor };
    setFiltros(nuevosFiltros);
    cargarAnuncios(nuevosFiltros, 0);
  };

  const irAPagina = (pagina) => {
    cargarAnuncios(filtros, pagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hayFiltrosActivos =
    filtros.nombre !== "" ||
    filtros.categoria !== "" ||
    filtros.estado !== "" ||
    filtros.precioMin !== "" ||
    filtros.precioMax !== "" ||
    filtros.orden !== "";

  const ordenarAnuncios = (lista, orden) => {
    if (!orden) return lista;
    const copia = [...lista];
    if (orden === "precio_asc") return copia.sort((a, b) => a.precio - b.precio);
    if (orden === "precio_desc") return copia.sort((a, b) => b.precio - a.precio);
    if (orden === "fecha_reciente") return copia.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
    if (orden === "fecha_antigua") return copia.sort((a, b) => new Date(a.fechaPublicacion) - new Date(b.fechaPublicacion));
    return copia;
  };

  const buscarUsuarios = async (texto) => {
    if (!texto.trim()) {
      setResultadosUsuarios([]);
      return;
    }
    setBuscandoUsuarios(true);
    try {
      const data = await getUsuarios(texto);
      setResultadosUsuarios(data);
    } catch {
      setResultadosUsuarios([]);
    } finally {
      setBuscandoUsuarios(false);
    }
  };

  // devuelve un array cómo [0, 1, 2, "...", 25]
  function generarPaginas(actual, total) {
    if (total <= 7) {
      const todas = [];
      for (let i = 0; i < total; i++) {
        todas.push(i);
      }
      return todas;
    }

    const paginas = [];
    paginas.push(0);

    if (actual > 3) paginas.push("...");

    const inicio = Math.max(1, actual - 1);
    const fin = Math.min(total - 2, actual + 1);
    for (let i = inicio; i <= fin; i++) paginas.push(i);

    if (actual < total - 4) paginas.push("...");

    paginas.push(total - 1);

    return paginas;
  }

  return (
    <div className="min-h-screen bg-transparent">

      {/* cabecera */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        {/* pestañas navegación */}
        <NavBar />

        <div className="max-w-5xl mx-auto px-4 py-4 space-y-3">

          {/* moneda y publicar */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-oferta-600 whitespace-nowrap">
              Anuncios
            </h1>

            <div className="flex items-center gap-2">
              {/* selector de moneda */}
              {usuario && (
                <div className="relative shrink-0">
                  <select
                    value={moneda}
                    onChange={(e) => cambiarMoneda(e.target.value)}
                    className="appearance-none border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500 text-gray-600 bg-white cursor-pointer"
                  >
                    {MONEDAS.map(m => (
                      <option key={m.codigo} value={m.codigo}>
                        {m.simbolo} {m.codigo}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400 text-xs">
                    ▼
                  </div>
                </div>
              )}

              {/* publicar anuncio */}
              {usuario && usuario.rol !== "ROLE_ADMIN" && (
                <button
                  onClick={() => navigate("/anuncio/nuevo")}
                  className="bg-oferta-500 hover:bg-oferta-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap"
                >
                  + Publicar
                </button>
              )}
            </div>
          </div>

          {/* buscadores */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* buscador anuncios */}
            <input
              type="text"
              placeholder="Buscar anuncios..."
              value={filtros.nombre}
              onChange={(e) => cambiarFiltro("nombre", e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
            />

            {/* buscador usuarios */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar vendedor..."
                value={busquedaUsuario}
                onChange={(e) => {
                  setBusquedaUsuario(e.target.value);
                  buscarUsuarios(e.target.value);
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
              />
              {/* resultados desplegables */}
              {busquedaUsuario.trim() && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                  {buscandoUsuarios && (
                    <p className="text-sm text-gray-400 px-4 py-3">Buscando...</p>
                  )}
                  {!buscandoUsuarios && resultadosUsuarios.length === 0 && (
                    <p className="text-sm text-gray-400 px-4 py-3">No se encontraron vendedores.</p>
                  )}
                  {!buscandoUsuarios && resultadosUsuarios.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        navigate(`/usuario/${u.id}`);
                        setBusquedaUsuario("");
                        setResultadosUsuarios([]);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-oferta-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-oferta-600">
                          {u.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{u.nombre}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* filtros */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">

          {/* categoría */}
          <select
            value={filtros.categoria}
            onChange={(e) => cambiarFiltro("categoria", e.target.value)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm border cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-oferta-500 transition-colors
        ${filtros.categoria
                ? "bg-oferta-500 text-white border-oferta-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-oferta-500"}`}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>

          {/* estado */}
          <select
            value={filtros.estado}
            onChange={e => cambiarFiltro("estado", e.target.value)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm border cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-oferta-500 transition-colors
        ${filtros.estado
                ? "bg-oferta-500 text-white border-oferta-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-oferta-500"}`}
          >
            <option value="">Cualquier estado</option>
            <option value="Perfecto">Perfecto</option>
            <option value="Muy_bueno">Muy bueno</option>
            <option value="Bueno">Bueno</option>
            <option value="Aceptable">Aceptable</option>
            <option value="Para_reparar">Para reparar</option>
          </select>

          {/* precio mín */}
          <input
            type="number" min="0" placeholder="Precio mín."
            value={filtros.precioMin}
            onChange={e => cambiarFiltro("precioMin", e.target.value)}
            className={`shrink-0 w-28 rounded-full px-3 py-1.5 text-sm border
        focus:outline-none focus:ring-2 focus:ring-oferta-500 transition-colors
        ${filtros.precioMin
                ? "bg-oferta-500 text-white border-oferta-500 placeholder:text-white"
                : "bg-white text-gray-600 border-gray-200 hover:border-oferta-500"}`}
          />

          {/* precio máx */}
          <input
            type="number" min="0" placeholder="Precio máx."
            value={filtros.precioMax}
            onChange={e => cambiarFiltro("precioMax", e.target.value)}
            className={`shrink-0 w-28 rounded-full px-3 py-1.5 text-sm border
        focus:outline-none focus:ring-2 focus:ring-oferta-500 transition-colors
        ${filtros.precioMax
                ? "bg-oferta-500 text-white border-oferta-500 placeholder:text-white"
                : "bg-white text-gray-600 border-gray-200 hover:border-oferta-500"}`}
          />

          {/* ordenar */}
          <select
            value={filtros.orden}
            onChange={e => cambiarFiltro("orden", e.target.value)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm border cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-oferta-500 transition-colors
        ${filtros.orden
                ? "bg-oferta-500 text-white border-oferta-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-oferta-500"}`}
          >
            <option value="">Ordenar por...</option>
            <option value="fecha_reciente">Más recientes</option>
            <option value="fecha_antigua">Más antiguos</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
          </select>

          {/* limpiar */}
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* contenido */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* error */}
        {error && (
          <div className="text-center py-20 text-red-400">
            <p>{error}</p>
          </div>
        )}

        {/* si no hay resultados */}
        {!error && anuncios.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>
              {filtros.nombre
                ? "No hay anuncios que coincidan."
                : "No hay anuncios disponibles."}
            </p>
          </div>
        )}

        {/* tarjetas */}
        {!error && anuncios.length > 0 && (
          <>
            {/* contador de resultados */}
            <p className="text-sm text-gray-400 mb-4">
              {totalAnuncios} anuncio{totalAnuncios !== 1 ? "s" : ""}
            </p>

            {/* grid responsive, 1 columna en móvil, 4 máximo en ordenador */}
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
          </>
        )}
        {/* paginación */}
        {totalPaginas > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3">

            <div className="flex items-center gap-1">
              {/* anterior */}
              <button
                onClick={() => irAPagina(paginaActual - 1)}
                disabled={paginaActual === 0}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200
                   text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>

              {/* números de página */}
              {generarPaginas(paginaActual, totalPaginas).map((item, i) =>
                item === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">...</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => irAPagina(item)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
              ${item === paginaActual
                        ? "bg-oferta-500 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {item + 1}
                  </button>
                )
              )}

              {/* siguiente */}
              <button
                onClick={() => irAPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas - 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200
                   text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>

            </div>
            {/* contador */}
            <span className="text-sm text-gray-400">
              Mostrando {paginaActual * 12 + 1}–{Math.min((paginaActual + 1) * 12, totalAnuncios)} de {totalAnuncios} anuncios
            </span>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}