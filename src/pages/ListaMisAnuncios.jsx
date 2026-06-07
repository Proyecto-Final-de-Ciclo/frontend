import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAnuncio, getMisAnuncios } from "../services/anuncioServices";
import { useUsuario } from "../context/UsuarioContext";
import AnuncioCard from "../components/AnuncioCard";
import { Tag } from "lucide-react";
import BotonVolver from "../components/BotonVolver";
import Footer from "../components/Footer"

export default function ListaMisAnuncios() {
  const navigate = useNavigate();
  const { usuario } = useUsuario();
  const [anuncios, setAnuncios] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  // si no hay usuario conectado lleva al login
  useEffect(() => {
    if (!usuario) navigate("/login");
  }, [usuario]);

  useEffect(() => {
    if (!usuario) return;
    const cargar = async () => {
      try {
        const data = await getMisAnuncios();
        setAnuncios(data);
      } catch {
        setError("No se pudieron cargar tus anuncios.");
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
        setAnuncios(prev => prev.filter(a => a.id !== id));
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
          <h1 className="text-xl font-bold text-naranja-600 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Mis anuncios
          </h1>
          {/* publicar */}
          <button
            onClick={() => navigate("/anuncio/nuevo")}
            className="ml-auto bg-naranja-500 hover:bg-naranja-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap"
          >
            + Publicar
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full flex flex-col">

        {cargando && (
          <div className="flex-1 flex items-center justify-center text-gray-400">Cargando...</div>
        )}

        {error && (
          <div className="flex-1 flex items-center justify-center text-red-400"><p>{error}</p></div>
        )}

        {!cargando && !error && anuncios.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-red-400">
            <p>Todavía no tienes anuncios publicados.</p>
            <button
              onClick={() => navigate("/anuncio/nuevo")}
              className="mt-4 text-naranja-600 underline text-sm"
            >
              Publicar mi primer anuncio
            </button>
          </div>
        )}

        {!cargando && !error && anuncios.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {anuncios.length} anuncio{anuncios.length !== 1 ? "s" : ""} publicado{anuncios.length !== 1 ? "s" : ""}
            </p>
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
      </main>
      <Footer />
    </div>
  );
}