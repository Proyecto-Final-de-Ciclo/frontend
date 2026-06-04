import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";
import NavBar from "../components/NavBar";
import { getLlamadas, publicarLlamada, deleteLlamada } from "../services/comunidadService";
import { getUsuarios } from "../services/usuarioService";
import Footer from "../components/Footer"

export default function Comunidad() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  const [pestanaActiva, setPestanaActiva] = useState("llamadas");

  const [llamadas, setLlamadas] = useState([]);
  const [errorLlamadas, setErrorLlamadas] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({
    frecuencia: "", modo: "SSB", mensaje: ""
  });
  const [minutos, setMinutos] = useState(30);
  const [publicando, setPublicando] = useState(false);
  const [errorPublicar, setErrorPublicar] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const cargarLlamadas = async () => {
    setErrorLlamadas(null);
    try {
      const data = await getLlamadas();
      setLlamadas(data);
    } catch {
      setErrorLlamadas("No se pudieron cargar las llamadas activas.");
    }
  };

  useEffect(() => {
    cargarLlamadas();
  }, []);

  const tiempoRestante = (expiraEn) => {
    const diff = new Date(expiraEn) - new Date();
    if (diff <= 0) return "Expirada";
    const horas = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (horas > 0) return `${horas}h ${mins} min`;
    return `${mins} min`;
  };

  const tiempoDesde = (fechaPublicacion) => {
    const diff = new Date() - new Date(fechaPublicacion);
    const horas = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (horas > 0) return `hace ${horas}h ${mins} min`;
    return `hace ${mins} min`;
  };

  const handlePublicar = async () => {
    if (!form.frecuencia.trim()) {
      setErrorPublicar("La frecuencia es obligatoria.");
      return;
    }
    setPublicando(true);
    setErrorPublicar(null);
    try {
      await publicarLlamada(form, minutos);
      setModalAbierto(false);
      setForm({ frecuencia: "", modo: "SSB", mensaje: "" });
      setMinutos(30);
      cargarLlamadas();
    } catch (e) {
      setErrorPublicar(e.message);
    } finally {
      setPublicando(false);
    }
  };

  const handleBorrar = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta llamada?")) return;
    try {
      await deleteLlamada(id);
      setLlamadas((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert("Error al borrar la llamada.");
    }
  };

  const miLlamada = usuario
    ? llamadas.find((l) => l.usuario?.id === usuario.id)
    : null;
  const otrasllamadas = llamadas.filter((l) => l.usuario?.id !== usuario?.id);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">

      {/* cabecera */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <NavBar />
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-bold text-oferta-600">Comunidad</h1>
            <span className="text-xs text-gray-400 uppercase tracking-widest hidden sm:inline">Llamadas · Radioaficionados</span>
          </div>
          {/* boton para usuarios logueados */}
          {usuario && usuario.indicativo && usuario.rol !== "ROLE_ADMIN" && (
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-oferta-500 hover:bg-oferta-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap hidden sm:block"
            >
              + Publicar llamada
            </button>
          )}
          {usuario && usuario.indicativo && usuario.rol !== "ROLE_ADMIN" && (
            <button
              onClick={() => setModalAbierto(true)}
              className="bg-oferta-500 hover:bg-oferta-600 text-white font-semibold px-3 py-2 rounded-xl text-sm transition-colors sm:hidden"
            >
              + Publicar
            </button>
          )}
        </div>
      </header>

      {/* pestañas */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex gap-2 py-2">
          {["llamadas", "buscar"].map((p) => (
            <button
              key={p}
              onClick={() => setPestanaActiva(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
                ${pestanaActiva === p
                  ? "bg-oferta-500 text-white border-oferta-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-oferta-200"
                }`}
            >
              {p === "llamadas" && "Llamadas activas"}
              {p === "buscar" && "Buscar radioaficionados"}
            </button>
          ))}
        </div>
      </div>

      {/* contenido */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full">

        {/* pestaña llamadas activas */}
        {pestanaActiva === "llamadas" && (
          <div>
            {errorLlamadas && (
              <p className="text-red-400 text-sm text-center py-10">{errorLlamadas}</p>
            )}

            {/* aviso si no tiene indicativo */}
            {usuario && !usuario.indicativo && usuario.rol !== "ROLE_ADMIN" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-4">
                Necesitas añadir tu indicativo en tu{" "}
                <span
                  className="underline cursor-pointer font-medium"
                  onClick={() => navigate("/perfil")}
                >
                  perfil
                </span>{" "}
                para publicar llamadas.
              </div>
            )}

            {!errorLlamadas && llamadas.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-32">
                No hay llamadas activas en este momento.
              </p>
            )}

            {/* llamada propia */}
            {miLlamada && (
              <div className="bg-white border-2 border-oferta-200 rounded-2xl p-4 mb-3 shadow-sm">
                <TarjetaLlamada
                  llamada={miLlamada}
                  esMia={true}
                  tiempoRestante={tiempoRestante}
                  tiempoDesde={tiempoDesde}
                  onBorrar={handleBorrar}
                  usuario={usuario}
                />
              </div>
            )}

            {/* restpo de llamadas */}
            {otrasllamadas.map((llamada) => (
              <div
                key={llamada.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm"
              >
                <TarjetaLlamada
                  llamada={llamada}
                  esMia={false}
                  tiempoRestante={tiempoRestante}
                  tiempoDesde={tiempoDesde}
                  onBorrar={handleBorrar}
                  usuario={usuario}
                />
              </div>
            ))}
          </div>
        )}

        {/* pestaña buscar indicativo */}
        {pestanaActiva === "buscar" && (
          <div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre, email o indicativo..."
                value={busqueda}
                onChange={async (e) => {
                  setBusqueda(e.target.value);
                  if (!e.target.value.trim()) {
                    setResultados([]);
                    return;
                  }
                  setBuscando(true);
                  try {
                    const data = await getUsuarios(e.target.value);
                    setResultados(data.filter((u) => u.indicativo));
                  } catch {
                    setResultados([]);
                  } finally {
                    setBuscando(false);
                  }
                }}
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-oferta-500"
              />
            </div>

            {buscando && (
              <p className="text-sm text-gray-400 text-center py-10">Buscando...</p>
            )}

            {/* estado vacío del principio */}
            {busqueda.trim() === "" && (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <div>
                  <p className="text-gray-500 font-semibold text-lg">Busca radioaficionados</p>
                  <p className="text-gray-400 text-base mt-1">Encuentra otros usuarios por su indicativo, nombre o localización</p>
                </div>
              </div>
            )}

            {/* sin resultados */}
            {!buscando && resultados.length === 0 && busqueda.trim() !== "" && (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <div>
                  <p className="text-gray-500 font-semibold text-lg">Sin resultados</p>
                  <p className="text-gray-400 text-base mt-1">
                    No se encontró ningún radioaficionado con "<span className="font-medium text-gray-500">{busqueda}</span>"
                  </p>
                </div>
              </div>
            )}

            {!buscando && resultados.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {resultados.map((u, i) => (
                  <div
                    key={u.id}
                    onClick={() => window.open(`https://www.qrz.com/db/${u.indicativo}`, "_blank")}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer
                      hover:bg-gray-50 transition-colors
                      ${i < resultados.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-oferta-50 border border-oferta-100
                      flex items-center justify-center text-xs font-semibold text-marino-500 shrink-0">
                      {u.indicativo.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{u.indicativo}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {u.nombre}
                        {u.localizacion ? ` · ${u.localizacion}` : ""}
                      </p>
                    </div>
                    <span className="text-gray-300 text-sm">›</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* cuadro publicar llamda */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-semibold text-gray-800">Publicar llamada</h2>
              <button
                onClick={() => { setModalAbierto(false); setErrorPublicar(null); }}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500
                  flex items-center justify-center text-sm hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">
                  Frecuencia
                </label>
                <input
                  value={form.frecuencia}
                  onChange={(e) => setForm({ ...form, frecuencia: e.target.value })}
                  placeholder="ej: 144.300 MHz"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-oferta-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">
                  Modo
                </label>
                <select
                  value={form.modo}
                  onChange={(e) => setForm({ ...form, modo: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-oferta-500 bg-white"
                >
                  <option>SSB</option>
                  <option>FM</option>
                  <option>CW</option>
                  <option>FT8</option>
                  <option>DMR</option>
                  <option>WSPR</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">
                  Expira en
                </label>
                <select
                  value={minutos}
                  onChange={(e) => setMinutos(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-oferta-500 bg-white"
                >
                  <option value={30}>30 minutos</option>
                  <option value={120}>2 horas</option>
                  <option value={1440}>24 horas</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1 block">
                Mensaje corto{" "}
                <span className="normal-case font-normal text-gray-300">
                  (opcional · máx. 120 caracteres)
                </span>
              </label>
              <textarea
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                maxLength={120}
                placeholder="ej: Activación SOTA desde EA1, buscando contactos HF..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-oferta-500 resize-none"
              />
              <p className="text-xs text-gray-300 text-right mt-1">
                {120 - form.mensaje.length} caracteres restantes
              </p>
            </div>

            {errorPublicar && (
              <p className="text-sm text-red-400 mb-3">{errorPublicar}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => { setModalAbierto(false); setErrorPublicar(null); }}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm
                  font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublicar}
                disabled={publicando}
                className="flex-1 py-2 rounded-xl bg-oferta-500 hover:bg-oferta-600 text-white
                  text-sm font-medium transition-colors disabled:opacity-50"
              >
                {publicando ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

// componente para las tarjetas de llamada
function TarjetaLlamada({ llamada, esMia, tiempoRestante, tiempoDesde, onBorrar, usuario  }) {
  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">
              {llamada.usuario?.indicativo || llamada.usuario?.nombre}
            </span>
            {esMia && (
              <span className="text-xs font-medium bg-oferta-500 text-white
                px-2 py-0.5 rounded-full">
                Tu llamada
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {llamada.usuario?.nombre}
            {llamada.usuario?.localizacion ? ` · ${llamada.usuario.localizacion}` : ""}
          </p>
        </div>
        <span className="text-xl font-medium text-oferta-500">{llamada.frecuencia}</span>
      </div>

      <div className="flex gap-2 flex-wrap mt-3">
        <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full border border-gray-200">
          {llamada.modo}
        </span>
      </div>

      {llamada.mensaje && (
        <p className="text-xs text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2 mt-3 break-all">
          💬 "{llamada.mensaje}"
        </p>
      )}

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">
            ⏱ Expira en {tiempoRestante(llamada.expiraEn)}
          </span>
          <span className="text-xs text-gray-400">
            🕐 Publicada {tiempoDesde(llamada.fechaPublicacion)}
          </span>
        </div>
        {(esMia || usuario?.rol === "ROLE_ADMIN") ? (
          <button
            onClick={() => onBorrar(llamada.id)}
            className="text-xs font-medium bg-red-50 text-red-400 border border-red-100
              px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors"
          >
            Borrar llamada
          </button>
        ) : (
          <button
            onClick={() => window.open(`https://www.qrz.com/db/${llamada.usuario?.indicativo}`, "_blank")}
            className="text-xs font-medium bg-oferta-50 text-oferta-600 border border-oferta-100
      px-3 py-1.5 rounded-xl hover:bg-oferta-100 transition-colors"
          >
            Ver en QRZ
          </button>
        )}
      </div>
    </>
  );
}