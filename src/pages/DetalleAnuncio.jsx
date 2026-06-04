import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { etiquetaEstado } from "../utils/estados";
import { getAnuncio, deleteAnuncio, getImagenesAnuncio } from "../services/anuncioServices";
import { useUsuario } from "../context/UsuarioContext";
import { esFavoritoAnuncio, addFavorito, removeFavorito } from "../services/favoritoService";
import { Star } from "lucide-react";
import BotonVolver from "../components/BotonVolver";
import Footer from "../components/Footer"

export default function DetalleAnuncio() {

  // useParams obtiene el id de la URL actual
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagenes, setImagenes] = useState([]);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);
  const [anuncio, setAnuncio] = useState(null);
  const [error, setError] = useState(null);

  const { usuario } = useUsuario();

  const [favorito, setFavorito] = useState(false);
  const [cargandoFav, setCargandoFav] = useState(false);
  const [indiceImagen, setIndiceImagen] = useState(0);

  const puedeBorrar = usuario && anuncio && (
    usuario.rol === "ROLE_ADMIN" ||
    anuncio.usuario?.id === usuario.id
  );
  const puedeEditar = usuario && anuncio && anuncio.usuario?.id === usuario.id;

  useEffect(() => {
    if (!usuario) return;
    esFavoritoAnuncio(id).then(setFavorito);
  }, [id, usuario]);

  // obtenemos los datos del anuncio del back
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getAnuncio(id);
        setAnuncio(data);
        const imgs = await getImagenesAnuncio(id);
        const ordenadas = [...imgs].sort((a, b) => b.esPrincipal - a.esPrincipal);
        setImagenes(ordenadas);
      } catch {
        setError("No se pudo cargar el anuncio.");
      }
    };
    cargar();
  }, [id]);

  const handleFavorito = async () => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    setCargandoFav(true);
    try {
      if (favorito) { await removeFavorito(id); setFavorito(false); }
      else { await addFavorito(id); setFavorito(true); }
    } catch { alert("Error al actualizar favorito"); }
    finally { setCargandoFav(false); }
  };

  // borra el anuncio y vuelve a la lista. 
  const handleDelete = async () => {
    if (window.confirm("¿Seguro que quieres borrar este anuncio?")) {
      try {
        await deleteAnuncio(id);
        const esPropietario = usuario && anuncio.usuario?.id === usuario.id;
        navigate(esPropietario ? "/mis-anuncios" : "/");
      } catch {
        alert("Error al borrar el anuncio");
      }
    }
  };

  // pantalla de carga para cuando anuncio es null y no hay error
  if (!error && !anuncio) return (
    <div className="min-h-screen bg-transparent flex items-center justify-center text-gray-400">
      Cargando...
    </div>
  );

  // pantalla de error
  if (error) return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-red-400 gap-4">
      <p>{error || "Anuncio no encontrado"}</p>
      <button
        onClick={() => navigate("/")}
        className="text-oferta-600 underline text-sm"
      >
        Volver a la lista
      </button>
    </div>
  );

  // pantalla detalle
  return (
    <div className="min-h-screen bg-transparent flex flex-col">

      {/* imagen ampliada */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={`${import.meta.env.VITE_APP_BACKEND}/files/${imagenAmpliada}`}
            alt="imagen ampliada"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
          />
        </div>
      )}
      {/* cabecera con botón volver */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <BotonVolver to="/" />
        </div>
      </header>

      {/* detalle */}
      <main className="max-w-2xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* imágenes */}
          <div className="relative bg-gray-50">
            {imagenes.length === 0 ? (
              <div className="h-64 sm:h-96 flex items-center justify-center text-gray-400 text-sm">
                Sin imágenes
              </div>
            ) : (
              <>
                {/* imagen actual */}
                <img
                  src={`${import.meta.env.VITE_APP_BACKEND}/files/${imagenes[indiceImagen].url}`}
                  alt="imagen del anuncio"
                  className="w-full h-64 sm:h-96 object-cover cursor-pointer"
                  onClick={() => setImagenAmpliada(imagenes[indiceImagen].url)}
                />

                {/* flechas */}
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={() => setIndiceImagen(prev => prev === 0 ? imagenes.length - 1 : prev - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setIndiceImagen(prev => prev === imagenes.length - 1 ? 0 : prev + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* puntos */}
                {imagenes.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {imagenes.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndiceImagen(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === indiceImagen ? "bg-oferta-500" : "bg-white/70"
                          }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-6">
            {/* nombre, precio y favorito */}
            <div className="flex justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">{anuncio.nombre}</h2>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-oferta-600">
                  {Number(anuncio.precio).toFixed(2)} €
                </p>
                {(!usuario || anuncio.usuario?.id !== usuario.id) && (
                  <button
                    onClick={handleFavorito}
                    disabled={cargandoFav}
                    className="text-2xl transition-colors hover:scale-110"
                    title={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
                  >
                    <Star
                      className="w-6 h-6"
                      fill={favorito ? "#FBBF24" : "none"}
                      stroke={favorito ? "#FBBF24" : "#9ca3af"}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* estado y fecha de publicación */}
            <div className="flex gap-3 mt-3">
              <span className="text-xs bg-oferta-50 text-oferta-600 font-medium px-3 py-1 rounded-full">
                {etiquetaEstado(anuncio.estado)}
              </span>
              <span className="text-xs text-gray-400 self-center">
                {anuncio.fechaPublicacion}
              </span>
            </div>

            {anuncio.usuario && (
              <p
                className="text-sm text-gray-500 mt-2 cursor-pointer hover:text-oferta-600 transition-colors"
                onClick={() => navigate(`/usuario/${anuncio.usuario.id}`)}
              >
                Vendedor: <span className="font-medium">{anuncio.usuario.nombre}</span>
              </p>
            )}

            {/* descripción completa */}
            <p className="text-gray-600 mt-5 leading-relaxed">
              {anuncio.descripcion || "Sin descripción"}
            </p>

            {/*botones */}
            {(puedeEditar || puedeBorrar) && (
              <div className="flex gap-2 mt-4">
                {puedeEditar && (
                  <button onClick={() => navigate(`/anuncio/${anuncio.id}/editar`)}
                    className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 rounded-lg transition-colors">
                    Editar
                  </button>
                )}
                {puedeBorrar && (
                  <button onClick={handleDelete}
                    className="flex-1 text-sm bg-red-50 hover:bg-red-100 text-red-500 font-medium py-1.5 rounded-lg transition-colors">
                    Borrar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}