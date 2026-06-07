import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BotonVolver({ to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => to ? navigate(to) : navigate(-1)}
      className="flex items-center gap-1.5 bg-gray-100 hover:bg-naranja-500 hover:text-white text-gray-600 text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
    >
      <ArrowLeft size={16} />
      Volver
    </button>
  );
}