import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMisFavoritos } from "../services/favoritoService";
import { deleteAnuncio } from "../services/anuncioServices";
import { useUsuario } from "../context/UsuarioContext";
import AnuncioCard from "../components/AnuncioCard";
import BotonVolver from "../components/BotonVolver";
import Footer from "../components/Footer"

export default function ListaFavoritos() {

  const navigate = useNavigate();
  const { usuario } = useUsuario();
  const [favoritos, setFavoritos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  // si no hay usuario conectado lleva al login
  useEffect(() => {
    if (!usuario) navigate("/login");
  }, [usuario]);

  // se cargan los favoritos del usuario
  useEffect(() => {
    if (!usuario) return;
    const cargar = async () => {
      try {
        const data = await getMisFavoritos();
        const anuncios = data;
        setFavoritos(anuncios);
      } catch {
        setError("No se pudieron cargar los favoritos.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres borrar este anuncio?")) {
      try {
        await deleteAnuncio(id);
        setFavoritos(prev => prev.filter(a => a.id !== id));
      } catch {
        alert("Error al borrar el anuncio");
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">

      {/* cabecera */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <BotonVolver to="/" />
          <h1 className="text-xl font-bold text-naranja-600">
            Mis favoritos
          </h1>
        </div>
      </header>

      {/* contenido */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full flex flex-col">

        {/* cargando */}
        {cargando && (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Cargando...
          </div>
        )}

        {/* error */}
        {error && (
          <div className="flex-1 flex items-center justify-center text-red-400">
            <p>{error}</p>
          </div>
        )}

        {/* sin favoritos */}
        {!cargando && !error && favoritos.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-red-400">
            <p>Todavía no tienes anuncios guardados.</p>
          </div>
        )}

        {/* mostar favoritos */}
        {!cargando && !error && favoritos.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {favoritos.length} anuncio{favoritos.length !== 1 ? "s" : ""} guardado{favoritos.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {favoritos.map((anuncio) => (
                <AnuncioCard
                  key={anuncio.id}
                  anuncio={anuncio}
                  imagenes={anuncio.imagenes || []}
                  onDelete={handleDelete}
                  usuario={usuario}
                  onFavoritoChange={() => setFavoritos(prev => prev.filter(a => a.id !== anuncio.id))}
                />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}