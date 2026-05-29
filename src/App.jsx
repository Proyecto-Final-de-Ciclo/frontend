import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaAnuncios from "./pages/ListaAnuncios";
import DetalleAnuncio from "./pages/DetalleAnuncio";
import FormularioAnuncio from "./pages/FormularioAnuncio";
import { UsuarioProvider } from "./context/UsuarioContext";
import Login from "./pages/Login";
import ListaFavoritos from "./pages/ListaFavoritos";
import ListaMisAnuncios from "./pages/ListaMisAnuncios";
import Registro from "./pages/Registro";
import ListaUsuarios from "./pages/ListaUsuarios";
import PerfilUsuario from "./pages/PerfilUsuario";
import { MonedaProvider } from "./context/MonedaContext";
import Noticias from "./pages/Noticias";
import GestionCategorias from "./pages/GestionCategorias";
import Comunidad from "./pages/Comunidad";
import Perfil from "./pages/Perfil";
import AvisoLegal from "./pages/AvisoLegal";
import Privacidad from "./pages/Privacidad";

export default function App() {
  return (
    <UsuarioProvider>
      <MonedaProvider>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<ListaAnuncios />} />
              <Route path="/login" element={<Login />} />
              <Route path="/anuncio/nuevo" element={<FormularioAnuncio />} />
              <Route path="/anuncio/:id" element={<DetalleAnuncio />} />
              <Route path="/anuncio/:id/editar" element={<FormularioAnuncio />} />
              <Route path="/favoritos" element={<ListaFavoritos />} />
              <Route path="/mis-anuncios" element={<ListaMisAnuncios />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/usuarios" element={<ListaUsuarios />} />
              <Route path="/usuario/:id" element={<PerfilUsuario />} />
              <Route path="/noticias" element={<Noticias />} />
              <Route path="/categorias/gestion" element={<GestionCategorias />} />
              <Route path="/comunidad" element={<Comunidad />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/aviso-legal" element={<AvisoLegal />} />
              <Route path="/privacidad" element={<Privacidad />} />
            </Routes>
        </BrowserRouter>
      </MonedaProvider>
    </UsuarioProvider>
  );
}