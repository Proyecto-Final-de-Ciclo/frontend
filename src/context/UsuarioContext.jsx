import { createContext, useContext, useState } from "react";
import { getUsuario, logout as logoutService } from "../services/usuarioService";

// creamos la variable global
const UsuarioContext = createContext(null);

// comparte el usuario con todos los componentes
export function UsuarioProvider({ children }) {

  // intentamos recuperar el usuario del localStorage
  const [usuario, setUsuario] = useState(getUsuario());

  // guarda el usuario cuando hace login
  const login = (datos) => setUsuario(datos);

  // borra el usuario cuando hace logout
  const logout = () => {
    logoutService();
    setUsuario(null);
  };

  return (
    <UsuarioContext.Provider value={{ usuario, login, logout }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuario() {
    return useContext(UsuarioContext);
}