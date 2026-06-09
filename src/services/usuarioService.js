const BASE = import.meta.env.VITE_APP_BACKEND;

export const login = async (nombre, password) => {
  const response = await fetch(`${BASE}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Usuario o contraseña incorrectos.");
  }

  const datos = await response.json();
  localStorage.setItem("token", datos.accessToken);

  const perfil = await fetch(`${BASE}/usuario/${datos.id}`, {
    headers: { "Authorization": `Bearer ${datos.accessToken}` },
  }).then(r => r.json());

  const usuarioCompleto = { ...datos, ...perfil, rol: datos.rol };
  localStorage.setItem("usuario", JSON.stringify(usuarioCompleto));
  return usuarioCompleto;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

export const getUsuario = () => {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
};

export const getToken = () => localStorage.getItem("token");

export const register = async (nombre, email, password) => {
  const response = await fetch(`${BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password, rol: "USER" }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al registrarse");
  }

  return await response.json();
};


const authHeader = () => ({ "Authorization": `Bearer ${getToken()}` });

export const getUsuarios = async (busqueda = "") => {
  const params = busqueda ? `?busqueda=${busqueda}` : "";
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE}/usuarios${params}`, {
    method: "GET",
    headers,
  });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Error al obtener los usuarios");
  return await response.json();
};

export const updateUsuario = async (id, usuario) => {
  const response = await fetch(`${BASE}/usuario/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(usuario),
  });
  if (!response.ok) throw new Error("Error al editar el usuario");
  return await response.json();
};

export const deleteUsuario = async (id) => {
  const response = await fetch(`${BASE}/usuario/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!response.ok) throw new Error("Error al borrar el usuario");
  return true;
};

export const getUsuarioPublico = async (id) => {
    const token = getToken();
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${BASE}/usuario/${id}`, { headers });
    if (!response.ok) throw new Error("Usuario no encontrado");
    return await response.json();
};

export const getAnunciosUsuario = async (id) => {
  const response = await fetch(`${BASE}/usuario/${id}/anuncios`);
  if (!response.ok) throw new Error("Error al obtener los anuncios");
  return await response.json();
};

export const editarPerfil = async (datos) => {
  const response = await fetch(`${BASE}/usuario/perfil`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("Error al editar el perfil");
  return await response.json();
};

export const cambiarPassword = async (passwordActual, passwordNueva) => {
  const response = await fetch(`${BASE}/usuario/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ passwordActual, passwordNueva }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Error al cambiar la contraseña");
  return data;
};