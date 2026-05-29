export const ETIQUETAS_CATEGORIA = {
  EMISORAS: "Emisoras",
  ANTENAS: "Antenas",
  WALKIE_TALKIES: "Walkie Talkies",
  AMPLIFICADORES: "Amplificadores",
  FUENTES_DE_ALIMENTACION: "Fuentes de alimentación",
  MEDIDORES_Y_ANALIZADORES: "Medidores y analizadores",
  ACCESORIOS: "Accesorios",
  COMPONENTES_ELECTRONICOS: "Componentes electrónicos",
  LIBROS_Y_MANUALES: "Libros y manuales",
  OTROS: "Otros",
};

export const etiquetaCategoria = (valor) => ETIQUETAS_CATEGORIA[valor] ?? valor;