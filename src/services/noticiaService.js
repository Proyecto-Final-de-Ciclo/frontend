// Proxy CORS gratuito que convierte RSS a JSON
const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

// Los mismos feeds y fuentes que tenías en el backend
const FEEDS = [
  { url: "https://www.ure.es/feed", fuente: "URE" },
  { url: "https://ea1uro.com/radio/feed", fuente: "EA1URO" },
  { url: "https://selvamarnoticias.com/feed", fuente: "Selvamar Noticias" },
];

export const getNoticias = async () => {
  const haceUnMes = new Date();
  haceUnMes.setDate(haceUnMes.getDate() - 30);

  // Lanzamos todas las peticiones en paralelo
  const resultados = await Promise.all(
    FEEDS.map(async ({ url, fuente }) => {
      try {
        const res = await fetch(`${RSS2JSON}${encodeURIComponent(url)}`);
        if (!res.ok) return [];
        const data = await res.json();
        if (data.status !== "ok") return [];

        return data.items
          .filter((item) => new Date(item.pubDate) >= haceUnMes)
          .map((item) => ({
            titulo: item.title,
            descripcion: limpiarHtml(item.description),
            enlace: item.link,
            fecha: item.pubDate.split(" ")[0], // "2026-06-06"
            fuente,
          }));
      } catch (err) {
        console.warn(`Error leyendo feed ${fuente}:`, err);
        return [];
      }
    })
  );

  // Aplanamos y ordenamos por fecha descendente
  return resultados
    .flat()
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
};

// Misma limpieza HTML que tenías en el backend
function limpiarHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#[0-9]+;/g, "")
    .replace(/\[…\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}