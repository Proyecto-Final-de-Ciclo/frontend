import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login as loginService } from "../services/usuarioService";
import { useUsuario } from "../context/UsuarioContext";
import { Eye, EyeOff } from "lucide-react";

export default function Registro() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombre: "", email: "", password: "", repetirPassword: "" });
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
    const { login } = useUsuario();
    const [verPassword, setVerPassword] = useState(false);
    const [verRepetirPassword, setVerRepetirPassword] = useState(false);

    const handleSubmit = async () => {
        if (!form.nombre || !form.email || !form.password || !form.repetirPassword) {
            setError("Rellena todos los campos.");
            return;
        }
        if (form.password !== form.repetirPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setCargando(true);
        try {
            await register(form.nombre, form.email, form.password);
            const datos = await loginService(form.nombre, form.password);
            login(datos);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">

                <h1 className="text-xl font-bold text-naranja-600 mb-6 text-center">
                    Crear cuenta
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
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    <div className="relative">
                        <input
                            type={verRepetirPassword ? "text" : "password"}
                            placeholder="Repetir contraseña"
                            value={form.repetirPassword}
                            onChange={(e) => setForm({ ...form, repetirPassword: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-naranja-500"
                        />
                        <button
                            type="button"
                            onClick={() => setVerRepetirPassword(!verRepetirPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-naranja-500 transition-colors"
                        >
                            {verRepetirPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={cargando}
                    className="w-full mt-6 bg-naranja-500 hover:bg-naranja-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
                >
                    {cargando ? "Registrando..." : "Registrarse"}
                </button>

                <button
                    onClick={() => navigate("/login")}
                    className="w-full mt-2 text-sm text-gray-400 hover:text-naranja-600 transition-colors"
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </button>

            </div>
        </div>
    );
}