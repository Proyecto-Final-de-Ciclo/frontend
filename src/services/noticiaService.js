const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

const BASE = import.meta.env.VITE_APP_BACKEND;

const FEEDS = [
  { url: "https://www.ure.es/feed", fuente: "URE" },
  { url: "https://ea1uro.com/radio/feed", fuente: "EA1URO" },
  { url: "https://selvamarnoticias.com/feed", fuente: "Selvamar Noticias" },
];

const getNoticiasBackend = async () => {
  const response = await fetch(`${BASE}/noticias`);
  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Error al obtener las noticias");
  return await response.json();
};

const getNoticiasFrontend = async () => {
  const haceUnMes = new Date();
  haceUnMes.setDate(haceUnMes.getDate() - 30);

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
            fecha: item.pubDate.split(" ")[0],
            fuente,
          }));
      } catch (err) {
        console.warn(`Error leyendo feed ${fuente}:`, err);
        return [];
      }
    })
  );

  return resultados
    .flat()
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
};

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

export const getNoticias = async () => {
  return import.meta.env.DEV ? getNoticiasBackend() : getNoticiasFrontend();
};