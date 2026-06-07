import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/usuarioService";
import { useUsuario } from "../context/UsuarioContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUsuario();
  const [form, setForm] = useState({ nombre: "", password: "" });
  const [error, setError] = useState(null);
  const [verPassword, setVerPassword] = useState(false);

  const handleSubmit = async () => {
    if (!form.nombre || !form.password) {
      setError("Rellena todos los campos.");
      return;
    }
    try {
      const datos = await loginService(form.nombre, form.password);
      login(datos);
      navigate("/");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">

        <h1 className="text-xl font-bold text-naranja-600 mb-6 text-center">
          Iniciar sesión
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-xl p-3">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            placeholder="Nombre de usuario"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-naranja-500"
          />
          <div className="relative">
            <input
              type={verPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-naranja-500"
            />
            <button
              type="button"
              onClick={() => setVerPassword(!verPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-naranja-500 transition-colors"
            >
              {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-naranja-500 hover:bg-naranja-600 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Entrar
        </button>
        <button
          onClick={() => navigate("/registro")}
          className="w-full mt-2 text-sm text-gray-400 hover:text-naranja-600 transition-colors"
        >
          ¿No tienes cuenta? Regístrate
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full mt-2 text-sm text-gray-400 hover:text-naranja-600 transition-colors"
        >
          Volver sin iniciar sesión
        </button>
      </div>
    </div>
  );
}