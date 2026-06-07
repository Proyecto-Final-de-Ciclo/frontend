import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-marino-700 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-4">

        {/* tres columnas compactas */}
        <div className="grid grid-cols-[1fr_0.8fr_1.4fr] gap-4 mb-3">

          {/* comunidad */}
          <div className="text-center">
            <p className="text-white/25 text-[10px] uppercase tracking-widest font-medium">
              Comunidad
            </p>
            <div className="flex gap-2 mt-1 flex-wrap items-center justify-center">
              <a href="https://www.ure.es" target="_blank" rel="noreferrer"
                className="text-white/40 text-xs hover:text-white/70 transition-colors">URE</a>
              <span className="text-white/15">·</span>
              <a href="https://www.qrz.com" target="_blank" rel="noreferrer"
                className="text-white/40 text-xs hover:text-white/70 transition-colors">QRZ.com</a>
              <span className="text-white/15">·</span>
              <a href="https://www.dxzone.com" target="_blank" rel="noreferrer"
                className="text-white/40 text-xs hover:text-white/70 transition-colors">DX Zone</a>
            </div>
          </div>

          {/* legal */}
          <div className="text-center">
            <p className="text-white/25 text-[10px] uppercase tracking-widest font-medium">
              Legal
            </p>
            <div className="flex gap-2 mt-1 flex-wrap items-center justify-center">
              <button onClick={() => navigate("/aviso-legal")}
                className="text-white/40 text-xs hover:text-white/70 transition-colors">Aviso legal</button>
              <span className="text-white/15">·</span>
              <button onClick={() => navigate("/privacidad")}
                className="text-white/40 text-xs hover:text-white/70 transition-colors">Privacidad</button>
            </div>
          </div>

          {/* sobre */}
          <div className="text-center">
            <p className="text-white/25 text-[10px] uppercase tracking-widest font-medium">
              Sobre RadioOferta
            </p>
            <div className="flex gap-2 mt-1 flex-wrap items-center justify-center">
              <button onClick={() => navigate("/sobre#que-es")}
                className="text-white/40 text-xs hover:text-white/70 transition-colors">Qué es</button>
              <span className="text-white/15">·</span>
              <button onClick={() => navigate("/sobre#proyecto")}
                className="text-white/40 text-xs hover:text-white/70 transition-colors">Proyecto</button>
              <span className="text-white/15">·</span>
              <button onClick={() => navigate("/sobre#agradecimientos")}
                className="text-white/40 text-xs hover:text-white/70 transition-colors">Agradecimientos</button>
            </div>
          </div>

        </div>

        {/* copyright */}
        <div className="border-t border-white/10 pt-3 flex items-center justify-between">
          <span className="text-white/20 text-[11px]">© 2026 RadiOferta</span>
          <span className="text-white/20 text-[11px]">73 de EA1IWS &amp; EA1EWZ</span>
        </div>

      </div>
    </footer>
  );
}