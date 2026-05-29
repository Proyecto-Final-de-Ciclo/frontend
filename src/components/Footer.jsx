// Componente Footer — se muestra en todas las páginas

export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-auto">

      {/* fila superior: descripción + agradecimientos y proyecto */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/10">

        {/* columna izquierda — sobre RadiOferta */}
        <div>
          <p className="text-white text-sm font-medium mb-2">RadiOferta</p>
          <p className="text-white/50 text-xs leading-relaxed">
            RadiOferta es una plataforma pensada para que la comunidad de radioaficionados y
            radioaficionadas pueda contar con las herramientas más útiles en un único sitio.
            Gracias a su apartado de compraventa de productos de radioafición, su sección de
            noticias relacionadas del último mes y la posibilidad de interactuar con otros
            usuarios en comunidad, RadiOferta ofrece un lugar completo donde centralizar
            todas tus necesidades de radioafición.
          </p>
        </div>

        {/* columna derecha — agradecimientos y proyecto */}
        <div className="flex flex-col gap-5">

          {/* agradecimientos */}
          <div>
            <p className="text-white/30 text-xs uppercase tracking-widest font-medium mb-1.5">
              Agradecimientos
            </p>
            <p className="text-white/50 text-xs leading-relaxed">
              Este proyecto no existiría sin{" "}
              <span className="text-white/85 font-medium">EA1IWS</span> (Fran) y{" "}
              <span className="text-white/85 font-medium">EA1EWZ</span> (Ramón),
              radioaficionados apasionados que me introdujeron en el mundillo y que
              tuvieron la idea de hacer esta página web. Gracias a los dos.
            </p>
          </div>

          {/* el proyecto */}
          <div>
            <p className="text-white/30 text-xs uppercase tracking-widest font-medium mb-1.5">
              El proyecto
            </p>
            <p className="text-white/50 text-xs leading-relaxed">
              Proyecto de Fin de Ciclo del Ciclo Dual de Desarrollo de Aplicaciones Web,
              curso 2025–2026, en el{" "}
              <a
                href="https://www.fernandowirtz.com/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-white/80 transition-colors"
              >
                IES Fernando Wirtz
              </a>
              .
            </p>
          </div>

        </div>
      </div>

      {/* fila inferior: comunidad, legal y sabías que */}
      <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-white/10">

        {/* comunidad y recursos */}
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest font-medium mb-2">
            Comunidad y recursos
          </p>
          <ul className="flex flex-col gap-1.5">
            <li>
              <a href="https://www.ure.es" target="_blank" rel="noreferrer"
                className="text-white/50 text-xs hover:text-white/80 transition-colors">
                URE — Unión de Radioaficionados Españoles
              </a>
            </li>
            <li>
              <a href="https://www.qrz.com" target="_blank" rel="noreferrer"
                className="text-white/50 text-xs hover:text-white/80 transition-colors">
                QRZ.com
              </a>
            </li>
            <li>
              <a href="https://www.dxzone.com" target="_blank" rel="noreferrer"
                className="text-white/50 text-xs hover:text-white/80 transition-colors">
                DX Zone
              </a>
            </li>
          </ul>
        </div>

        {/* legal */}
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest font-medium mb-2">
            Legal
          </p>
          <ul className="flex flex-col gap-1.5">
            <li>
              <a href="/aviso-legal"
                className="text-white/50 text-xs hover:text-white/80 transition-colors">
                Aviso legal
              </a>
            </li>
            <li>
              <a href="/privacidad"
                className="text-white/50 text-xs hover:text-white/80 transition-colors">
                Política de privacidad
              </a>
            </li>
          </ul>
        </div>

        {/* sabías que */}
        <div>
          <p className="text-white/30 text-xs uppercase tracking-widest font-medium mb-2">
            ¿Sabías que...?
          </p>
          <p className="text-white/75 text-xs font-medium mb-1">73</p>
          <p className="text-white/45 text-xs leading-relaxed">
            El código Q más conocido entre radioaficionados. Significa "mejores deseos"
            y se usa como despedida en cada contacto.
          </p>
        </div>

      </div>

      {/* barra de copyright */}
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-white/25 text-xs">© 2026 RadiOferta</span>
        <span className="text-white/25 text-xs">73 de EA1IWS &amp; EA1EWZ</span>
      </div>

    </footer>
  );
}
