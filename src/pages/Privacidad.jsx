// Página de Política de Privacidad — ruta: /privacidad

import { useNavigate } from "react-router-dom";
import BotonVolver from "../components/BotonVolver";
import Footer from "../components/Footer"

export default function Privacidad() {

  return (
    <div className="flex flex-col min-h-screen bg-transparent flex flex-col">

      {/* cabecera */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <BotonVolver />
          <h1 className="text-lg font-bold text-gray-800">Política de privacidad</h1>
        </div>
      </header>

      {/* contenido */}
      <main className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-8">

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-gray-800">Datos que se recogen</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Al registrarte en RadiOferta, se almacenan tu nombre de usuario, dirección de
              email y contraseña. La contraseña se guarda cifrada y nunca es accesible en texto
              plano. De forma opcional, puedes añadir información adicional a tu perfil como
              tu nombre real, ubicación o indicativo de radioaficionado. Estos datos adicionales
              son siempre voluntarios.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-gray-800">Para qué se usan</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Los datos recogidos se usan exclusivamente para identificarte dentro de la
              plataforma y mostrarte como vendedor en tus anuncios. No se comparten con
              terceros, no se usan con fines publicitarios ni se ceden a ningún servicio externo.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-gray-800">Entorno académico</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              RadiOferta es un proyecto académico. Los datos almacenados residen en una base
              de datos de pruebas y no tienen ningún uso fuera de este entorno. No existe
              ningún tratamiento comercial ni analítico de la información personal.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-medium text-gray-800">Tus derechos</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Tienes derecho a acceder a tus datos, modificarlos desde tu perfil y solicitar
              la eliminación de tu cuenta en cualquier momento. Si quieres que tu cuenta y
              tus datos sean eliminados por completo, puedes solicitarlo y se llevará a cabo
              sin ningún problema.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
