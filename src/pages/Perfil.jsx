import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/UsuarioContext";
import NavBar from "../components/NavBar";
import { editarPerfil } from "../services/usuarioService";
import Footer from "../components/Footer"

export default function Perfil() {
  const { usuario, login } = useUsuario();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) navigate("/login");
    if (usuario?.rol === "ROLE_ADMIN") navigate("/");
  }, [usuario]);

  const [pestanaActiva, setPestanaActiva] = useState("datos");

  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    nombreReal: usuario?.nombreReal || "",
    apellidos: usuario?.apellidos || "",
    email: usuario?.email || "",
    localizacion: usuario?.localizacion || "",
    mostrarEmail: usuario?.mostrarEmail || false,
    mostrarNombreReal: usuario?.mostrarNombreReal || false,
    mostrarApellidos: usuario?.mostrarApellidos || false,
    mostrarUbicacion: usuario?.mostrarUbicacion || false,
    descripcion: usuario?.descripcion || "",
    mostrarDescripcionVendedor: usuario?.mostrarDescripcionVendedor || false,
    indicativo: usuario?.indicativo || "",
    activoDesde: usuario?.activoDesde || "",
    modos: usuario?.modos || "",
    descripcionRadio: usuario?.descripcionRadio || "",
    qslBuro: usuario?.qslBuro || false,
    mostrarDescripcionRadio: usuario?.mostrarDescripcionRadio || false,
    mostrarActivoDesde: usuario?.mostrarActivoDesde || false,
  });

  const [formPassword, setFormPassword] = useState({
    actual: "", nueva: "", repetir: ""
  });
  const [errorPassword, setErrorPassword] = useState(null);
  const [guardandoPassword, setGuardandoPassword] = useState(false);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const set = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }));

  const handleGuardar = async () => {
    setError(null);
    setExito(false);
    if (form.indicativo && !/^[A-Za-z]{1,3}\d[A-Za-z]{1,4}$/.test(form.indicativo)) {
      setError("El indicativo no tiene un formato válido (ej: EA1IWS).");
      return;
    }
    setGuardando(true);
    try {
      const actualizado = await editarPerfil(form);
      login({ ...usuario, ...actualizado, rol: usuario.rol });
      setExito(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarPassword = async () => {
    setErrorPassword(null);
    if (!formPassword.actual.trim()) {
      setErrorPassword("Introduce tu contraseña actual.");
      return;
    }
    if (formPassword.nueva.length < 6) {
      setErrorPassword("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (formPassword.nueva !== formPassword.repetir) {
      setErrorPassword("Las contraseñas no coinciden.");
      return;
    }
    setGuardandoPassword(true);
    try {
      await editarPerfil({ ...form, password: formPassword.nueva, passwordActual: formPassword.actual });
      setFormPassword({ actual: "", nueva: "", repetir: "" });
      setExito(true);
    } catch (e) {
      setErrorPassword(e.message);
    } finally {
      setGuardandoPassword(false);
    }
  };

  const años = [];
  for (let y = new Date().getFullYear(); y >= 1950; y--) años.push(y);

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-transparent flex flex-col">

      {/* cabecera */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <NavBar />
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-naranja-600">Mi perfil</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Gestiona tus datos y decide qué ven los demás
          </p>
        </div>
      </header>

      {/* pestañas */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 flex gap-2 py-2">
          {[
            { id: "datos", label: "Mis datos" },
            { id: "anuncios", label: "Perfil anuncios" },
            { id: "radio", label: "Perfil radio" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPestanaActiva(p.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
                ${pestanaActiva === p.id
                  ? "bg-naranja-500 text-white border-naranja-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-naranja-200"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6 flex-1 w-full">

        {exito && (
          <div className="bg-green-100 border border-green-300 rounded-xl px-4 py-3
  text-sm font-medium text-green-800 mb-4">
            Cambios guardados correctamente.
          </div>
        )}

        {/* mis datos */}
        {pestanaActiva === "datos" && (
          <div className="flex flex-col gap-4">

            {/* datos básicos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-800">Datos básicos</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Información general de tu cuenta
                </p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-4">

                {/* nombre de usuario */}
                <Campo label="Nombre de usuario" siemprePublico>
                  <input
                    value={form.nombre}
                    onChange={(e) => set("nombre", e.target.value)}
                    className={estiloInput}
                  />
                </Campo>

                {/* nombre real */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Campo
                    label="Nombre"
                    publico={form.mostrarNombreReal}
                    onToggle={() => set("mostrarNombreReal", !form.mostrarNombreReal)}
                  >
                    <input
                      value={form.nombreReal}
                      onChange={(e) => set("nombreReal", e.target.value)}
                      placeholder="Tu nombre real"
                      className={estiloInput}
                    />
                  </Campo>
                  <Campo
                    label="Apellidos"
                    publico={form.mostrarApellidos}
                    onToggle={() => set("mostrarApellidos", !form.mostrarApellidos)}
                  >
                    <input
                      value={form.apellidos}
                      onChange={(e) => set("apellidos", e.target.value)}
                      placeholder="Tus apellidos"
                      className={estiloInput}
                    />
                  </Campo>
                </div>

                {/* email */}
                <Campo
                  label="Email"
                  publico={form.mostrarEmail}
                  onToggle={() => set("mostrarEmail", !form.mostrarEmail)}
                >
                  <input
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={estiloInput}
                  />
                </Campo>

                {/* ubicación */}
                <Campo
                  label="Ubicación"
                  publico={form.mostrarUbicacion}
                  onToggle={() => set("mostrarUbicacion", !form.mostrarUbicacion)}
                >
                  <input
                    value={form.localizacion}
                    onChange={(e) => set("localizacion", e.target.value)}
                    placeholder="ej: Galicia, España"
                    className={estiloInput}
                  />
                </Campo>

                {/* miembro desde */}
                <Campo label="Miembro desde" siemprePublico>
                  <input
                    value={usuario.fechaRegistro || ""}
                    disabled
                    className={estiloInputDeshabilitado}
                  />
                </Campo>

              </div>
            </div>

            {/* contraseña */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-800">Contraseña</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Cambia tu contraseña de acceso
                </p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-4">
                <div>
                  <label className={estiloLabel}>Contraseña actual</label>
                  <input
                    type="password"
                    value={formPassword.actual}
                    onChange={(e) => setFormPassword(p => ({ ...p, actual: e.target.value }))}
                    className={estiloInput}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={estiloLabel}>Nueva contraseña</label>
                    <input
                      type="password"
                      value={formPassword.nueva}
                      onChange={(e) => setFormPassword(p => ({ ...p, nueva: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      className={estiloInput}
                    />
                  </div>
                  <div>
                    <label className={estiloLabel}>Repetir contraseña</label>
                    <input
                      type="password"
                      value={formPassword.repetir}
                      onChange={(e) => setFormPassword(p => ({ ...p, repetir: e.target.value }))}
                      placeholder="Repite la contraseña"
                      className={estiloInput}
                    />
                  </div>
                </div>
                {errorPassword && (
                  <p className="text-xs text-red-400">{errorPassword}</p>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleCambiarPassword}
                    disabled={guardandoPassword}
                    className="bg-naranja-500 hover:bg-naranja-600 text-white text-sm font-medium
                      px-5 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {guardandoPassword ? "Guardando..." : "Cambiar contraseña"}
                  </button>
                </div>
              </div>
            </div>

            <BotonesGuardar
              guardando={guardando}
              error={error}
              onGuardar={handleGuardar}
              onCancelar={() => navigate(-1)}
            />
          </div>
        )}

        {/* perfil anuncios */}
        {pestanaActiva === "anuncios" && (
          <div className="flex flex-col gap-4">

            {/* descripción vendedor */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-800">
                  Descripción de vendedor
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Preséntate a compradores y vendedores
                </p>
              </div>
              <div className="px-5 py-4">
                <Campo
                  label="Descripción"
                  publico={form.mostrarDescripcionVendedor}
                  onToggle={() => set("mostrarDescripcionVendedor", !form.mostrarDescripcionVendedor)}
                >
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => set("descripcion", e.target.value)}
                    rows={3}
                    maxLength={300}
                    placeholder="Preséntate como vendedor..."
                    className={`${estiloInput} resize-none`}
                  />
                </Campo>
              </div>
            </div>

            {/* valoración */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-800">Tu valoración</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Basada en las reseñas recibidas · no editable
                </p>
              </div>
              <div className="px-5 py-4 flex items-center gap-3">
                <span className="text-3xl font-medium text-gray-800">
                  {usuario.mediaEstrellas?.toFixed(1) || "—"}
                </span>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`text-lg ${i <= Math.round(usuario.mediaEstrellas || 0)
                          ? "text-yellow-400" : "text-gray-200"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {usuario.totalReseñas || 0} reseñas recibidas
                  </p>
                </div>
              </div>
            </div>

            <BotonesGuardar
              guardando={guardando}
              error={error}
              onGuardar={handleGuardar}
              onCancelar={() => navigate(-1)}
            />
          </div>
        )}

        {/* perfil radio */}
        {pestanaActiva === "radio" && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-800">
                  Datos de radioaficionado
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Tu identidad en el apartado Comunidad.
                  Necesitas indicativo para publicar llamadas.
                </p>
              </div>
              <div className="px-5 py-4 flex flex-col gap-4">

                {/* indicativo */}
                <Campo label="Indicativo" siemprePublico>
                  <input
                    value={form.indicativo}
                    onChange={(e) => set("indicativo", e.target.value.toUpperCase())}
                    placeholder="ej: EA1ABC"
                    className={estiloInput}
                  />
                </Campo>

                {/* activo desde */}
                <Campo
                  label="Activo desde"
                  publico={form.mostrarActivoDesde}
                  onToggle={() => set("mostrarActivoDesde", !form.mostrarActivoDesde)}
                >
                  <select
                    value={form.activoDesde}
                    onChange={(e) => set("activoDesde", e.target.value)}
                    className={estiloInput}
                  >
                    <option value="">Selecciona un año</option>
                    {años.map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                </Campo>

                {/* modos */}
                <Campo label="Modos de operación" siemprePublico>
                  <input
                    value={form.modos}
                    onChange={(e) => set("modos", e.target.value)}
                    placeholder="ej: SSB, CW, FT8..."
                    className={estiloInput}
                  />
                </Campo>

                {/* QSL buró */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={estiloLabel}>QSL por buró</span>
                    <span className="text-xs text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full">
                      Siempre público
                    </span>
                  </div>
                  <button
                    onClick={() => set("qslBuro", !form.qslBuro)}
                    className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-colors
                      ${form.qslBuro
                        ? "bg-naranja-50 text-marino-500 border-naranja-200"
                        : "bg-gray-50 text-gray-400 border-gray-200"
                      }`}
                  >
                    {form.qslBuro ? "✓ Acepto QSL por buró" : "✗ No acepto QSL por buró"}
                  </button>
                </div>

                <hr className="border-gray-50" />

                {/* descripción radio */}
                <Campo
                  label="Descripción radio"
                  publico={form.mostrarDescripcionRadio}
                  onToggle={() => set("mostrarDescripcionRadio", !form.mostrarDescripcionRadio)}
                >
                  <textarea
                    value={form.descripcionRadio}
                    onChange={(e) => set("descripcionRadio", e.target.value)}
                    rows={3}
                    placeholder="Cuéntanos sobre tu actividad en radio..."
                    className={`${estiloInput} resize-none`}
                  />
                </Campo>
              </div>
            </div>

            <BotonesGuardar
              guardando={guardando}
              error={error}
              onGuardar={handleGuardar}
              onCancelar={() => navigate(-1)}
            />
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}

// estilos
const estiloInput = `w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
  focus:outline-none focus:ring-2 focus:ring-naranja-500 bg-white`;

const estiloInputDeshabilitado = `w-full border border-gray-100 rounded-xl px-3 py-2
  text-sm bg-gray-50 text-gray-400`;

const estiloLabel = `block text-xs font-medium text-gray-400 uppercase
  tracking-wide mb-1`;

// envuelve cada campo con su etiqueta y botón público/privado
function Campo({ label, children, siemprePublico, publico, onToggle }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={estiloLabel}>{label}</span>
        {siemprePublico && (
          <span className="text-xs text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full">
            Siempre público
          </span>
        )}
        {!siemprePublico && onToggle && (
          <button
            onClick={onToggle}
            className={`text-xs font-medium px-3 py-0.5 rounded-full border transition-colors
              ${publico
                ? "bg-naranja-50 text-marino-500 border-naranja-200"
                : "bg-gray-50 text-gray-400 border-gray-200"
              }`}
          >
            {publico ? "👁 Público" : "🔒 Privado"}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// botones de cancelar y guardar
function BotonesGuardar({ guardando, error, onGuardar, onCancelar }) {
  return (
    <div>
      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancelar}
          className="px-5 py-2 rounded-xl border border-gray-200 text-sm
            font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onGuardar}
          disabled={guardando}
          className="px-5 py-2 rounded-xl bg-naranja-500 hover:bg-naranja-600 text-white
            text-sm font-medium transition-colors disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}