import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnuncio, createAnuncio, updateAnuncio, getImagenesAnuncio, deleteImagenAnuncio, addImagenesAnuncio } from "../services/anuncioServices";
import { useUsuario } from "../context/UsuarioContext";
import BotonVolver from "../components/BotonVolver";
import { getCategorias } from "../services/categoriaService";
import Footer from "../components/Footer"

// desplegable estado
const ESTADOS = [
  { valor: "Perfecto", etiqueta: "Perfecto" },
  { valor: "Muy_bueno", etiqueta: "Muy bueno" },
  { valor: "Bueno", etiqueta: "Bueno" },
  { valor: "Aceptable", etiqueta: "Aceptable" },
  { valor: "Para_reparar", etiqueta: "Para reparar" },
];

export default function FormularioAnuncio() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useUsuario();
  const [imagenesActuales, setImagenesActuales] = useState([]);
  const esEdicion = Boolean(id);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState(null);
  const [imagenesSecundarias, setImagenesSecundarias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [generandoIA, setGenerandoIA] = useState(false);

  // si no hay usuario conectado se va al login
  useEffect(() => {
    if (!usuario) navigate("/login");
  }, [usuario]);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    estado: "",
    descripcion: "",
    categoriaId: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);

  // cargar los datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const cats = await getCategorias();
        setCategorias(cats);

        // en edición cargamos el anuncio
        if (esEdicion) {
          const anuncio = await getAnuncio(id);
          if (anuncio) {
            // rellenamos el formulario con los datos que vienen del backend
            setForm({
              nombre: anuncio.nombre || "",
              precio: anuncio.precio || "",
              estado: anuncio.estado || "Bueno",
              descripcion: anuncio.descripcion || "",
              categoriaId: anuncio.categoria?.id || "",
            });
            const imgs = await getImagenesAnuncio(id);
            setImagenesActuales(imgs);
          }
        }
      } catch {
        setError("Error al cargar los datos");
      }
    };
    cargarDatos();
  }, [id, esEdicion]); // se reejecuta si cambia el id o el modo

  // e.target.name es el nombre del campo que cambió
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // al publicar anuncio o guardar cambios
  const handleSubmit = async () => {
    // validaciones
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!form.precio || parseFloat(form.precio) <= 0) {
      setError("El precio debe ser mayor que 0.");
      return;
    }
    if (!form.estado) {
      setError("El estado es obligatorio.");
      return;
    }
    if (!form.categoriaId) {
      setError("La categoría es obligatoria.");
      return;
    }
    const tienePrincipalActual = imagenesActuales.some(img => img.esPrincipal);
    if (!imagenPrincipal && !tienePrincipalActual) {
      setError("Debes subir una imagen principal.");
      return;
    }

    //se contruye un anuncio
    const nuevoAnuncio = {
      id: Number(id),
      nombre: form.nombre,
      precio: parseFloat(form.precio),
      estado: form.estado,
      fechaPublicacion: new Date().toISOString().split("T")[0],
      descripcion: form.descripcion,
      categoria: form.categoriaId ? { id: Number(form.categoriaId) } : null,
    };

    setError(null);
    setCargando(true);

    try {
      if (esEdicion) {
        // actualiza el anuncio y crea un array de imágenes
        await updateAnuncio(id, nuevoAnuncio);
        const nuevasImagenes = imagenPrincipal
          ? [imagenPrincipal, ...imagenesSecundarias]
          : imagenesSecundarias;
        // añade las imágenes actualizadas al anuncio actualizado
        if (nuevasImagenes.length > 0) {
          const indicePrincipal = imagenPrincipal ? 0 : -1;
          await addImagenesAnuncio(id, nuevasImagenes, indicePrincipal);
        }
      } else {
        const files = imagenPrincipal ? [imagenPrincipal, ...imagenesSecundarias] : imagenesSecundarias;
        await createAnuncio(nuevoAnuncio, files, 0);
      }
      navigate("/mis-anuncios");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGenerarDescripcion = async () => {
    if (!form.nombre.trim()) {
      setError("Escribe primero el nombre del producto para generar la descripción.");
      return;
    }
    setGenerandoIA(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND}/anuncio/ia/descripcion?nombre=${encodeURIComponent(form.nombre)}`,
        { headers: { "Content-Type": "application/json" } }
      );
      const data = await response.json();
      setForm(prev => ({ ...prev, descripcion: data.message }));
      setError(null);
    } catch {
      setError("Error al generar la descripción con IA.");
    } finally {
      setGenerandoIA(false);
    }
  };

  // pantalla formulario
  return (
    <div className="min-h-screen bg-transparent">
      {/* imagen ampliada */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={imagenAmpliada}
            alt="imagen ampliada"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
          />
        </div>
      )}

      {/* cabecera */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          {/* navigate(-1) vuelve a la página anterior del historial */}
          <BotonVolver />
          <h1 className="text-lg font-bold text-gray-800">
            {esEdicion ? "Editar anuncio" : "Nuevo anuncio"}
          </h1>
        </div>
      </header>

      {/* formulario */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* mensaje de error */}
          {error && (
            <div className="mb-5 text-sm text-red-600 bg-red-50 rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* imágenes */}
            <div className="space-y-3">

              {/* imagen principal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen principal *
                </label>

                {/* miniatura */}
                {(imagenPrincipal || imagenesActuales.some(img => img.esPrincipal)) && (
                  <div className="relative mb-2 inline-block">
                    <img
                      src={imagenPrincipal
                        ? URL.createObjectURL(imagenPrincipal)
                        : `${import.meta.env.VITE_APP_BACKEND}/files/${imagenesActuales.find(img => img.esPrincipal).url}`}
                      alt="principal"
                      className="h-32 w-32 object-cover rounded-xl ring-4 ring-oferta-500 cursor-pointer hover:opacity-90"
                      onClick={() => setImagenAmpliada(
                        imagenPrincipal
                          ? URL.createObjectURL(imagenPrincipal)
                          : `${import.meta.env.VITE_APP_BACKEND}/files/${imagenesActuales.find(img => img.esPrincipal).url}`
                      )}
                    />
                    <span className="absolute bottom-1 left-1 bg-oferta-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {imagenPrincipal && esEdicion ? "Nueva" : "Principal"}
                    </span>
                  </div>
                )}

                {/* botones */}
                <div className="flex items-center gap-2">
                  <input id="imagenPrincipal" type="file" accept="image/*"
                    onChange={(e) => setImagenPrincipal(e.target.files[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="imagenPrincipal"
                    className="mt-2 inline-block cursor-pointer text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-1.5 rounded-xl transition-colors"
                  >
                    {imagenPrincipal || imagenesActuales.some(img => img.esPrincipal) ? "Cambiar" : "Seleccionar"}
                  </label>
                  {imagenPrincipal && esEdicion && (
                    <button
                      onClick={() => setImagenPrincipal(null)}
                      className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-500 font-medium px-4 py-1.5 rounded-xl transition-colors"
                    >
                      Deshacer
                    </button>
                  )}
                </div>
              </div>

              {/* imágenes secundarias */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imágenes secundarias
                </label>

                {/* actuales (solo en edición) */}
                {imagenesActuales.filter(img => !img.esPrincipal).length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {imagenesActuales.filter(img => !img.esPrincipal).map(img => (
                      <div key={img.id} className="relative">
                        <img
                          src={`${import.meta.env.VITE_APP_BACKEND}/files/${img.url}`}
                          alt="secundaria"
                          className="h-32 w-32 object-cover rounded-xl cursor-pointer hover:opacity-90"
                          onClick={() => setImagenAmpliada(`${import.meta.env.VITE_APP_BACKEND}/files/${img.url}`)}
                        />
                        <button
                          onClick={() => {
                            deleteImagenAnuncio(id, img.id);
                            setImagenesActuales(prev => prev.filter(i => i.id !== img.id));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* nuevas (creación y edición) */}
                {imagenesSecundarias.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {imagenesSecundarias.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="secundaria"
                          className="h-32 w-32 object-cover rounded-xl cursor-pointer hover:opacity-90"
                          onClick={() => setImagenAmpliada(URL.createObjectURL(file))}
                        />
                        <button
                          onClick={() => setImagenesSecundarias(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* botón añadir */}
                <input id="imagenesSecundarias" type="file" multiple accept="image/*"
                  onChange={(e) => {
                    const nuevas = Array.from(e.target.files);
                    const actuales = imagenesActuales.filter(img => !img.esPrincipal).length;
                    if (actuales + imagenesSecundarias.length + nuevas.length > 5) {
                      setError("No puedes subir más de 5 imágenes secundarias.");
                      return;
                    }
                    setImagenesSecundarias(prev => [...prev, ...nuevas]);
                  }}
                  className="hidden"
                />
                <label htmlFor="imagenesSecundarias"
                  className="mt-2 inline-block cursor-pointer text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-1.5 rounded-xl transition-colors"
                >
                  Añadir
                </label>
              </div>
            </div>
            {/* nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Walkie Talkie Motorola"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
              />
            </div>

            {/* precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (€) *
              </label>
              <input
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
              />
            </div>

            {/* estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                style={{ color: form.estado === "" ? "#9ca3af" : "inherit" }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
              >
                <option value="" disabled hidden>Selecciona un estado...</option>
                {ESTADOS.map((e) => (
                  <option key={e.valor} value={e.valor} style={{ color: "black" }}>{e.etiqueta}</option>
                ))}
              </select>
            </div>

            {/* categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                style={{ color: form.estado === "" ? "#9ca3af" : "inherit" }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>

            {/* descripción */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <button
                  type="button"
                  onClick={handleGenerarDescripcion}
                  disabled={generandoIA}
                  className="text-xs bg-oferta-50 hover:bg-oferta-100 disabled:opacity-50 disabled:cursor-not-allowed text-oferta-600 font-medium px-3 py-1 rounded-lg transition-colors"
                >
                  {generandoIA ? "Generando..." : "✨ Generar con IA"}
                </button>
              </div>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe el artículo..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-oferta-500 resize-none"
              />
            </div>
          </div>

          {/* botones */}
          <div className="flex gap-3 mt-8">

            {/* cancelar */}
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
            >
              Cancelar
            </button>

            {/* guardar o publicar */}
            <button
              onClick={handleSubmit}
              disabled={cargando}
              className="flex-1 bg-oferta-500 hover:bg-oferta-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
            >
              {cargando ? (
                esEdicion ? "Guardando..." : "Publicando..."
              ) : (
                esEdicion ? "Guardar cambios" : "Publicar anuncio"
              )}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
