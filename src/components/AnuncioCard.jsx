import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { etiquetaEstado } from "../utils/estados";
import { esFavoritoAnuncio, addFavorito, removeFavorito } from "../services/favoritoService";
import { Star } from "lucide-react";
import { useMoneda, MONEDAS } from "../context/MonedaContext";

export default function AnuncioCard({ anuncio, imagenes, onDelete, usuario, onFavoritoChange }) {

  const navigate = useNavigate();
  const [favorito, setFavorito] = useState(false);
  const [cargandoFav, setCargandoFav] = useState(false);
  const { moneda, convertir, cargando } = useMoneda();

  const puedeBorrar = usuario && (
    usuario.rol === "ROLE_ADMIN" ||
    anuncio.usuario?.id === usuario.id
  );
  const puedeEditar = usuario && anuncio.usuario?.id === usuario.id;

  useEffect(() => {
    if (!usuario) {
      setFavorito(false);
      return;
    }
    esFavoritoAnuncio(anuncio.id).then(setFavorito);
  }, [anuncio.id, usuario]);

  const handleFavorito = async () => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    setCargandoFav(true);
    try {
      if (favorito) {
        await removeFavorito(anuncio.id);
        setFavorito(false);
        if (onFavoritoChange) {
          onFavoritoChange();
        }
      } else {
        await addFavorito(anuncio.id);
        setFavorito(true);
      }
    } catch {
      alert("Error al actualizar favorito");
    } finally {
      setCargandoFav(false);
    }
  };

  return (
    // contenedor de la tarjeta
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">

      {/* zona superior con la imagn, si hacemos click va al detalle del anuncio */}
      <div
        className="h-40 bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => navigate(`/anuncio/${anuncio.id}`)}
      >
        {imagenes.length > 0 ? (
          <img
            src={`${import.meta.env.VITE_APP_BACKEND}/files/${(imagenes.find(i => i.esPrincipal) || imagenes[0]).url}`}
            alt={anuncio.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Sin imagen</span>
          </div>
        )}
      </div>

      {/* zona inferior, información del anuncio */}
      <div className="p-4 flex flex-col flex-1">

        {/* titulo, se se hace click va al detalle del anuncio */}
        <h3
          className="font-semibold text-gray-800 truncate cursor-pointer hover:text-oferta-600 transition-colors"
          onClick={() => navigate(`/anuncio/${anuncio.id}`)}
        >
          {anuncio.nombre}
        </h3>

        {/* descripción de máximo 2 líneas */}
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
          {anuncio.descripcion}
        </p>

        {anuncio.usuario && (
          <div
            className="flex items-center gap-1.5 mt-1 cursor-pointer group"
            onClick={(e) => { e.stopPropagation(); navigate(`/usuario/${anuncio.usuario.id}`); }}
          >
            <p className="text-xs text-gray-400 group-hover:text-oferta-600 transition-colors">
              {anuncio.usuario.nombre}
            </p>
          </div>
        )}

        {/* estado a la izquierda y fecha a la derecha */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs bg-oferta-50 text-oferta-600 font-medium px-2 py-0.5 rounded-full">
            {etiquetaEstado(anuncio.estado)}
          </span>
          <span className="text-xs text-gray-400">{anuncio.fechaPublicacion}</span>
        </div>

        {/* precio con dos decimales y favorito */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-xl font-bold text-oferta-600">
            {moneda === "EUR"
              ? `${convertir(anuncio.precio)} €`
              : `${MONEDAS.find(m => m.codigo === moneda)?.simbolo}${cargando ? "..." : convertir(anuncio.precio)}`
            }
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

        {(puedeEditar || puedeBorrar) && (
          <div className="flex gap-2 mt-4">
            {puedeEditar && (
              <button onClick={() => navigate(`/anuncio/${anuncio.id}/editar`)}
                className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 rounded-lg transition-colors">
                Editar
              </button>
            )}
            {puedeBorrar && (
              <button onClick={() => onDelete(anuncio.id)}
                className="flex-1 text-sm bg-red-50 hover:bg-red-100 text-red-500 font-medium py-1.5 rounded-lg transition-colors">
                Borrar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}