import { useNavigate } from "react-router-dom";
import BotonVolver from "../components/BotonVolver";
import Footer from "../components/Footer";

export default function AvisoLegal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent flex flex-col">

      {/* cabecera */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <BotonVolver />
          <h1 className="text-lg font-bold text-gray-800">Aviso legal</h1>
        </div>
      </header>

      {/* contenido */}
      <main className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-8">

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-gray-800">Sobre RadiOferta</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              RadiOferta es un proyecto de fin de ciclo desarrollado como parte del Ciclo Dual
              de Desarrollo de Aplicaciones Web en el IES Fernando Wirtz, curso 2025–2026.
              No tiene carácter comercial ni ánimo de lucro.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-gray-800">Contenido de la plataforma</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              El contenido publicado en la plataforma, incluyendo anuncios y perfiles de usuario,
              es ficticio o de prueba y no representa transacciones reales. RadiOferta no actúa
              como intermediario en ninguna compraventa ni se responsabiliza del contenido
              publicado por los usuarios.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-gray-800">Disponibilidad del servicio</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Al tratarse de un proyecto académico, no se garantiza la disponibilidad continua
              del servicio ni la integridad de los datos almacenados. El uso de la plataforma
              es exclusivamente educativo y de demostración.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-gray-800">Propiedad intelectual</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              El diseño, el código y los textos de RadiOferta son obra de su autor y están
              protegidos como trabajo académico. Queda prohibida su reproducción total o
              parcial sin autorización expresa.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
