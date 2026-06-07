import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Sobre() {
    const { hash } = useLocation();

    // al cargar, si hay ancla (#que-es, #proyecto, etc.) hace scroll hasta ella
    useEffect(() => {
        if (hash) {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <NavBar />
            </header>

            <main className="max-w-3xl mx-auto px-4 py-10 space-y-12 flex-1 w-full">

                {/* qué es */}
                <section id="que-es">
                    <h1 className="text-2xl font-bold text-naranja-600 mb-4">Qué es RadiOferta</h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        RadiOferta es una plataforma pensada para que la comunidad de radioaficionados y
                        radioaficionadas pueda contar con las herramientas más útiles en un único sitio.
                        Gracias a su apartado de compraventa de productos de radioafición, su sección de
                        noticias relacionadas del último mes y la posibilidad de interactuar con otros
                        usuarios en comunidad, RadiOferta ofrece un lugar completo donde centralizar
                        todas tus necesidades de radioafición.
                    </p>
                </section>

                {/* proyecto */}
                <section id="proyecto">
                    <h2 className="text-xl font-bold text-naranja-600 mb-4">El proyecto</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Proyecto de Fin de Ciclo del Ciclo Dual de Desarrollo de Aplicaciones Web,
                        curso 2025–2026, en el{" "}
                        <a
                            href="https://www.fernandowirtz.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-naranja-500 underline underline-offset-2 hover:text-naranja-600 transition-colors"
                            IES Fernando Wirtz >
                        </a>.
                    </p>
                </section>

                {/* agradecimientos */}
                <section id="agradecimientos">
                    <h2 className="text-xl font-bold text-naranja-600 mb-4">Agradecimientos</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Este proyecto no existiría sin{" "}
                        <span className="font-medium text-gray-800">EA1IWS</span> (Fran) y{" "}
                        <span className="font-medium text-gray-800">EA1EWZ</span> (Ramón),
                        radioaficionados apasionados que me introdujeron en el mundillo y que
                        tuvieron la idea de hacer esta página web. Gracias a los dos.
                    </p>
                </section>

            </main>

            <Footer />
        </div>
    );
}